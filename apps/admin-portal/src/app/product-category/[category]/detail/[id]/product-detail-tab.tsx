import { Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import PackageList from "./package-list";
import BenefitList from "./benefit-list";
import DetailList from "./detail-list";
import ChannelList from "./channel-list";

export default function ProductDetatilTab(props: { id: string; category: string; }) {
  const { id, category } = props;

  return (
    <Tabs defaultValue="packages">
      <TabsList aria-label="Tabs" className="grid w-full grid-cols-4">
        <TabsTrigger value="packages">Packages</TabsTrigger>
        <TabsTrigger value="benefits">Benefits</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="channels">Channels</TabsTrigger>
      </TabsList>
      <TabsContent value="packages">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <PackageList id={id} category={category} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="benefits">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <BenefitList id={id} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="details">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailList id={id} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="channels">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <ChannelList id={id} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
