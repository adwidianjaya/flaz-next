import Button from "./components/button";
import Card from "./components/card";
import Container from "./components/container";
import Text from "./components/text";
import ShortTextInput from "./components/short-text-input";

const Components = {
  Button,
  Card,
  Container,
  Text,
  ShortTextInput,
};

const Element = ({ type, props, children }) => {
  const Component = Components[type];
  // console.log({ type, Component });

  if (!Component) return null;

  return (
    <Component {...props}>
      {children?.map((element, index) => {
        return <Element key={index} {...element} />;
      })}
    </Component>
  );
};

const JsonRenderer = ({ elements = [] }) => {
  // console.log({ elements });

  return (
    <>
      {elements?.map((element, index) => {
        return <Element key={index} {...element} />;
      })}
    </>
  );
};

export { JsonRenderer };
