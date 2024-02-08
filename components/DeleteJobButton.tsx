import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { deleteJobAction } from "@/utils/actions";
import { useToast } from "@/components/ui/use-toast";

const DeleteJobBtn = ({ id }: { id: string }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteJobAction(id),
    onSuccess: (data) => {
      if (!data) {
        return toast({
          description: "Error occurred. Couldn't delete a job",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["charts"] });

      toast({ description: "job removed" });
    },
  });

  return (
    <Button
      size="sm"
      disabled={isPending}
      variant="destructive"
      onClick={() => {
        mutate(id);
      }}
    >
      {isPending ? "deleting" : "delete"}
    </Button>
  );
};

export default DeleteJobBtn;
