
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const BookingTabs = ({ setTab, tab, setFilterType }: any) => {

  const handleTabChange = (value: string) => {
    setTab(value);
    if (value === "booked") {
      setFilterType("upcoming");
    }
  }
  return (
    <Tabs
      value={tab}
      onValueChange={(value: string) => handleTabChange(value as "" | "booked" | "completed")}
      className="w-full"
    >
      <TabsList className="flex gap-2">
        <TabsTrigger
          value=""
          className={`${tab === "" ? "bg-primary text-primary" : "bg-transparent text-black cursor-pointer"}`}
        >
          All Bookings
        </TabsTrigger>
        <TabsTrigger
          value="booked"
          className={`${tab === "booked" ? "bg-primary text-primary" : "bg-transparent text-black cursor-pointer"}`}
        >
          Upcoming
        </TabsTrigger>
        <TabsTrigger
          value="completed"
          className={`${tab === "completed" ? "bg-primary text-primary" : "bg-transparent text-black cursor-pointer"}`}
        >
          Completed
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
