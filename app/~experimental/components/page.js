import Button from "@/lib/json-render/catalog/components/button";
import Card from "@/lib/json-render/catalog/components/card";
import TextInput from "@/lib/json-render/catalog/components/text-input";

const Page = () => {
  return (
    <div className="grid grid-cols-3 gap-4 container mx-auto my-12">
      <Button label="Label" variant="outline" size="lg" disabled={false} />
      <Card
        title="Title"
        description="Description"
        width
        maxWidth
        centered={false}
        layout="stack"
        gap="4"
        columns="1"
      />
      <TextInput
        label="Label"
        placeholder="Placeholder"
        description="Description"
        disabled={false}
        value
        type="text"
        rows={2}
      />
    </div>
  );
};

export default Page;
