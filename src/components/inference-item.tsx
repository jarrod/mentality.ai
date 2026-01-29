import { Button } from "@/components/ui/button"
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemTitle
} from "@/components/ui/item"
import { getServerOpenRouterInference } from "@/functions/infer"
import { useQuery } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"

export function InferenceItem() {
    const getInference = useServerFn(getServerOpenRouterInference)

    const { data, isFetching, error, refetch } = useQuery({
        queryKey: ["openrouter-inference"],
        queryFn: () => getInference(),
        enabled: false,
    })

    return (
        <div className="flex w-full max-w-md flex-col gap-6">
            <Item variant="outline">
                <ItemContent>
                    <ItemTitle>Basic Item</ItemTitle>
                    <ItemDescription>
                        A simple item with title and description.
                    </ItemDescription>
                    <div className="mt-3 text-sm text-muted-foreground">
                        {isFetching
                            ? "Loading inference…"
                            : error
                                ? "Failed to load inference."
                                : data ?? "No inference yet."}
                    </div>
                </ItemContent>
                <ItemActions>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
                        disabled={isFetching}
                    >
                        Run inference
                    </Button>
                </ItemActions>
            </Item>

        </div>
    )
}
