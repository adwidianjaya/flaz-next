import { spec as Button } from "./components/button";
import { spec as Card } from "./components/card";
import { spec as Container } from "./components/container";
import { spec as Text } from "./components/text";
import { spec as ShortTextInput } from "./components/short-text-input";

const components = { Button, Card, Container, Text, ShortTextInput };
for (const componentName of Object.keys(components)) {
  components[componentName].props = components[componentName].props.properties;
}

export { components };
