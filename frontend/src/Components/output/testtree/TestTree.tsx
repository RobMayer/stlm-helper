import { Component } from "react";
import AbstractTree from "../../../Utility/tree/abstract";
import FileTree from "../../../Utility/tree/filetree";

type TestTreeComponent<T extends AbstractTree<any>, M extends Object> =
  | ((props: TreeNodeProps<T> & M) => JSX.Element)
  | typeof Component<TreeNodeProps<T> & M, any>;

type TestTreeDisplay<T extends AbstractTree<any>, M extends Object> = {
  tree: T;
};

type TreeNodeProps<T extends AbstractTree<any>> = {
  tree: T;
};

type TestTreeNodeRenderer<T extends AbstractTree<any>, M extends Object> = {
  nodeComponent: TestTreeComponent<T, M>;
};

type TestNodeDelgator<M extends Object> = {
  nodeProps: M;
};

/* WRAPPER TEST */

const EndGoalNode = () => {
  return <></>;
};

type Thing = {
  something: boolean;
};

const EndGoal = () => {
  const tree = new FileTree("/", { isFolder: true, name: "something" });

  return (
    <>
      <OneLevelTree tree={tree} isLoaded={true} />
      <WrapperTree tree={tree} nodeComponent={EndGoalNode} />
    </>
  );

  // return <WrapperTree<Thing> nodeComponent={EndGoalNode} tree={tree} something={true} />;
};

/* WRAPPER TEST */

type WrapperBits = {
  isFolded: boolean;
  doFolding: () => void;
};

const WrapperNode = <M extends Object>(
  props: TestTreeNodeRenderer<FileTree, {}> & TreeNodeProps<FileTree> & WrapperBits & M
) => {
  const { tree, nodeComponent: NodeComponent, isFolded, doFolding } = props;
  return <NodeComponent tree={tree} />;
};

const WrapperTree = <M extends Object>(
  props: TestTreeDisplay<FileTree, {}> & TestTreeNodeRenderer<FileTree, M> & M
) => {
  const { tree, nodeComponent } = props;

  const isFolded = false;

  return (
    <BaseTree<FileTree, TestTreeNodeRenderer<FileTree, M> & WrapperBits>
      tree={tree}
      nodeComponent={WrapperNode}
      nodeProps={{ nodeComponent, isFolded, doFolding: () => {} }}
    />
  );
};

/* FIRST LEVEL TEST */

type OneLevelType = {
  isLoaded: boolean;
};

type OtherLevelType = {
  isLoaded: string;
};

const OneLevelNode = (props: TreeNodeProps<FileTree> & OneLevelType) => {
  return <></>;
};

const OneLevelTree = ({
  tree,
  isLoaded,
}: TestTreeDisplay<FileTree, {}> & OneLevelType & TestNodeDelgator<OneLevelType>) => {
  return <BaseTree<FileTree, OneLevelType> tree={tree} nodeComponent={OneLevelNode} nodeProps={{ isLoaded }} />;
};

/* BASE TREE */

const BaseTree = <T extends AbstractTree<any>, M extends Object>(
  props: TestTreeDisplay<T, M> & TestTreeNodeRenderer<T, M> & TestNodeDelgator<M>
) => {
  const { tree, nodeProps, nodeComponent: NodeComponent } = props;
  return (
    <>
      <NodeComponent tree={tree} {...nodeProps} />
    </>
  );
};
