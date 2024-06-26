import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MultiSelectDropdown } from "./multi-select-dropdown";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Module } from "@/routes/lan/hooks/use-module";
import ModuleLauncherButton from "./module-launcher-button";
import { useEffect, useState } from "react";

type ArpSpoofDialogProps = {
  arpSpoof: Module;
  ips: string[];
  gatewayIp: string;
  hostIp: string;
  handleClick: (selectedIps: Set<string>) => void;
  targetIps: string[];
};

export function ArpSpoofDialog({
  arpSpoof,
  ips,
  gatewayIp,
  hostIp,
  handleClick,
  targetIps,
}: ArpSpoofDialogProps) {
  const [selectedIps, setSelectedIps] = useState(new Set(targetIps));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setSelectedIps(new Set(targetIps));
    }
  }, [open]);

  useEffect(() => {
    setSelectedIps(new Set(targetIps));
  }, [targetIps]);

  const handleCanStart = () => !gatewayIp || !hostIp || selectedIps.size === 0;

  const handleClickWithSelectedIps = () => {
    handleClick(selectedIps);
    setOpen(false);
  };

  const handleStop = (event: React.MouseEvent) => {
    if (arpSpoof.isRunning) {
      event.preventDefault();
      arpSpoof.stop();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ModuleLauncherButton
          module={arpSpoof}
          moduleName="ARP Spoof"
          targetIps={targetIps}
          onClick={handleStop}
        />
      </DialogTrigger>
      <DialogContent className="w-11/12 max-w-[30rem] p-5 sm:p-6">
        <DialogHeader>
          <DialogTitle>ARP Spoof</DialogTitle>
          <DialogDescription className="hidden sm:block">
            This module performs a MITM attack that intercepts network traffic
            of selected hosts using spoofed ARP packets.
          </DialogDescription>
        </DialogHeader>
        <>
          <div className="grid">
            <Label className="mb-2">Target hosts</Label>
            <MultiSelectDropdown
              options={ips}
              triggerTitle="Select target hosts"
              searchTitle="Search by IP"
              selectedValues={new Set(selectedIps)}
              setSelectedValues={setSelectedIps}
              limit={5}
            />
          </div>
          <div className="grid">
            <Label className="mb-2">Gateway</Label>
            <Badge
              variant={gatewayIp === "" ? "destructive" : "secondary"}
              className="w-fit px-2 py-[0.1rem] text-sm"
            >
              {gatewayIp}
              {gatewayIp === "" && "Not found"}
            </Badge>
          </div>
          <div className="grid">
            <Label className="mb-2">Source</Label>
            <Badge
              variant={hostIp === "" ? "destructive" : "secondary"}
              className="w-fit px-2 py-[0.1rem] text-sm"
            >
              {hostIp}
              {hostIp === "" && "Not found"}
            </Badge>
          </div>
        </>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" type="button" className="mt-2 sm:mt-0">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={handleClickWithSelectedIps}
            disabled={handleCanStart()}
          >
            Start ARP spoofing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
