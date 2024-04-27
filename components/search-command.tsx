"use client"

import { api } from "@/convex/_generated/api";
import { useSearch } from "@/hooks/use-search";
import { useUser } from "@clerk/clerk-react"
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { File } from "lucide-react";

export const SearchCommand=()=>{
    const {user}=useUser();
    const router=useRouter();
    const documents=useQuery(api.documents.getSearch);
    const [isMounted,setisMounted]=useState(false);

    const toggle=useSearch((search)=>search.toggle);
    const isOpen=useSearch((store)=>store.isOpen);
    const onClose=useSearch((store)=>store.onClose);

    useEffect(()=>{
        setisMounted(true);
    },[]);

    if(!isMounted){
        return null;
    }

    return(
        <CommandDialog open={isOpen} onOpenChange={onClose}>
            <CommandInput
            placeholder={`Search ${user?.fullName}'s Notebook...`}/>
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Documents">
                    {
                        documents?.map((document)=>(
                            <CommandItem
                            key={document._id}
                            value={`${document._id}-${document.title}`}
                            title={document.title}
                            onSelect={()=>{}}>
                                {document.icon ? (
                                    <p className="mr-2 text-[18px]">
                                        {document.icon}
                                    </p>
                                ):(
                                    <File className="mr-2 h-4 w-4"/>
                                )}
                                <span>{document.title}</span>

                            </CommandItem>
                        ))
                    }

                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )

}