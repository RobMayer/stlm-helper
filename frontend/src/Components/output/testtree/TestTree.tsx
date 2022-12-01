import { Component, useCallback } from "react";
import AbstractTree from "../../../Utility/tree/abstract";
import FileTree from "../../../Utility/tree/filetree";

type TreeDisplayProps<T extends AbstractTree<any>> = {
  tree: T;
};

type TreeNodeProps<T extends AbstractTree<any>> = {
  tree: T;
  nodeId: string;
  depth: boolean[];
};

type TreeNodeRenderer<T extends AbstractTree<any>, M extends Object> = {
  nodeComponent: ((props: TreeNodeProps<T> & M) => JSX.Element) | typeof Component<TreeNodeProps<T> & M, any>;
};

type TreeNodeDelegator<M extends Object> = {
  nodeProps: M;
};

/* END GOAL */

type DelegatedProps = {
  usedFiles: string[];
};

const EndGoalThing = ({ tree, nodeId, depth, isFolded, onFold, usedFiles }: ExtendedNodeProps<DelegatedProps>) => {
  const entry = tree.get(nodeId);

  return <>{entry.name}</>;
};

const EndGoal = () => {
  const tree = new FileTree("/", { isFolder: true, name: "root" });

  return (
    <>
      <span>This is a simulacrum of an actual layout component</span>
      <ExtendedTree<DelegatedProps> tree={tree} nodeComponent={EndGoalThing} nodeProps={{ usedFiles: [] }} />
    </>
  );
};

/* EXTENDED VERSION */
export type ExtendedProps = {
  isFolded: boolean;
  onFold: () => void;
};

export type ExtendedNodeProps<T extends Object> = TreeNodeProps<FileTree> & ExtendedProps & T;

const ExtendedNode = <O extends Object>({
  nodeComponent: NodeComponent,
  ...props
}: TreeNodeProps<FileTree> & TreeNodeRenderer<FileTree, ExtendedProps & O>) => {
  return <NodeComponent isFolded={true} onFold={() => {}} {...(props as O & TreeNodeProps<FileTree>)} />;
};

type ExtendedTreeType<T extends AbstractTree<any>, I extends Object, E extends Object> = TreeDisplayProps<T> &
  TreeNodeRenderer<T, I> &
  TreeNodeDelegator<E>;

export const ExtendedTree = <E extends Object>({
  tree,
  nodeComponent,
  nodeProps,
}: TreeDisplayProps<FileTree> & TreeNodeRenderer<FileTree, ExtendedProps & E> & TreeNodeDelegator<E>) => {
  const Delegate = useCallback(
    ({ nodeComponent: nC, ...p }: TreeNodeProps<FileTree> & TreeNodeRenderer<FileTree, ExtendedProps & E>) => {
      return <ExtendedNode<E> {...p} nodeComponent={nC} />;
    },
    []
  );

  return (
    <BaseTree<FileTree, TreeNodeRenderer<FileTree, ExtendedProps & E>>
      tree={tree}
      nodeComponent={Delegate}
      nodeProps={{ ...nodeProps, nodeComponent }}
    />
  );
};

/* FIRST LEVEL TEST */

type OneLevelType = {
  isLoaded: boolean;
};

const OneLevelNode = ({ isLoaded, tree, nodeId, depth }: TreeNodeProps<FileTree> & OneLevelType) => {
  return <></>;
};

const OneLevelTree = ({
  tree,
  isLoaded,
}: TreeDisplayProps<FileTree> & OneLevelType & TreeNodeDelegator<OneLevelType>) => {
  return <BaseTree<FileTree, OneLevelType> tree={tree} nodeComponent={OneLevelNode} nodeProps={{ isLoaded }} />;
};

/* BASE TREE */

const BaseTree = <T extends AbstractTree<any>, M extends Object>(
  props: TreeDisplayProps<T> & TreeNodeRenderer<T, M> & TreeNodeDelegator<M>
) => {
  const { tree, nodeProps, nodeComponent: NodeComponent } = props;
  return (
    <>
      <NodeComponent tree={tree} {...nodeProps} nodeId={tree.root()} depth={[]} />
    </>
  );
};
