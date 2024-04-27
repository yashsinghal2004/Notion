"use client"

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./Spinner";
import { Search } from "lucide-react";
import { Input } from "./ui/input";


export const TrashBox = () => {
    const router=useRouter();
    const params=useParams();
    const documents=useQuery(api.documents.getTrash);
    const restore=useMutation(api.documents.restore);
    const remove=useMutation(api.documents.remove);

    const [search,setSearch]=useState("");

    const filteredDocuments=documents?.filter((document)=>{
        return document.title.toLowerCase().includes(search.toLowerCase());
    })

    const onClick=(documentId:string)=>{
        router.push(`/documents/${documentId}`);
    }

    const onRestore=(
        event:React.MouseEvent<HTMLDivElement,MouseEvent>,
        documentId:Id<"documents">
    )=>{
        event.stopPropagation();
        const promise=restore({id:documentId});

        toast.promise(promise,{
            loading:"Restoring note...",
            success:"Note Restored!",
            error:"Failed to restore note."
        })
    }

    const onRemove=(
        event:React.MouseEvent<HTMLDivElement,MouseEvent>,
        documentId:Id<"documents">
    )=>{
        event.stopPropagation();
        const promise=remove({id:documentId});

        toast.promise(promise,{
            loading:"Deleting note...",
            success:"Note deleted!",
            error:"Failed to delete note."
        })
        if(params.documentId===documentId){
            router.push("/documents");
        }
    }

    if(documents===undefined){
        return(
            <div className="h-full flex items-center justify-center p-4">
                <Spinner size="lg"/>
            </div>
        )
    }

    

    return ( 
    <div className="text-sm">
        <div className="flex items-center gap-x-1 p-2">
            <Search className="h-4 w-4"/>
            <Input
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="h-7 px-2 focus-visible:ring-transparent bg-secondary "
            placeholder="Filter by page title..."/>
        </div>
        <div className="mt-2 px-1 pb-1">
            <p className="hidden last:block text-xs text-center text-muted-foreground
            pb-2 ">No documents found.</p>
            {filteredDocuments?.map((document)=>(
                <div
                key={document._id}
                role="button"
                onClick={()=>onClick(document._id)}
                className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"

                >
                    <span>{document.title}</span>

                </div>
            ))}
        </div>
    </div> 
    );
}