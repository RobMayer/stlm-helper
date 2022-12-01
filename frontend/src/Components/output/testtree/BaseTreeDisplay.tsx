import { Component, HTMLAttributes, useCallback } from "react";
import AbstractTree from "../../../Utility/tree/abstract";

export type TreeNodeProps<T extends AbstractTree<any>> = {
  tree: T;
  nodeId: string;
  depth: boolean[];
};

export type TreeNodeRenderer<T extends AbstractTree<any>, M extends Object> = {
  nodeComponent: ((props: TreeNodeProps<T> & M) => JSX.Element) | typeof Component<TreeNodeProps<T> & M, any>;
};

export type TreeNodeDelegator<M extends Object> = {
  nodeProps: M;
};

export type TreeDisplayProps<T extends AbstractTree<any>> = {
  tree: T;
  showRoot?: boolean;
  rootName?: string;
};

type BaseTreeProps<T extends AbstractTree<any>, M extends Object> = TreeDisplayProps<T> &
  TreeNodeRenderer<T, M> &
  TreeNodeDelegator<M>;

const BaseTreeDisplay = <T extends AbstractTree<any>, M extends Object>({
  tree,
  nodeProps,
  nodeComponent: NodeComponent,
  showRoot = false,
  rootName,
  ...props
}: BaseTreeProps<T, M> & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props}>
      {showRoot ? (
        <NodeComponent tree={tree} nodeId={tree.root()} depth={[]} name={rootName} {...nodeProps} />
      ) : (
        tree.get(tree.root()).children.map((childKey: string) => {
          <NodeComponent key={childKey} tree={tree} depth={[]} nodeId={childKey} {...nodeProps} />;
        })
      )}
    </div>
  );
};

export default BaseTreeDisplay;

/* WHAT EVEN IS MY HEAD ABOUT */

type INodeHandler<T extends AbstractTree<any>, N extends Object> = <E extends Object>(
  p: TreeNodeProps<T> & TreeNodeRenderer<T, N & E>
) => JSX.Element;

export const extendTree = <T extends AbstractTree<any>, N extends Object>(NodeHandler: INodeHandler<T, N>) => {
  return <E extends Object>({
    tree,
    nodeComponent,
    nodeProps,
  }: TreeDisplayProps<T> & TreeNodeRenderer<T, N & E> & TreeNodeDelegator<E>) => {
    const Delegate = useCallback(({ nodeComponent: nC, ...p }: TreeNodeProps<T> & TreeNodeRenderer<T, N & E>) => {
      return <NodeHandler<E> {...p} nodeComponent={nC} />;
    }, []);

    return (
      <BaseTreeDisplay<T, TreeNodeRenderer<T, N & E>>
        tree={tree}
        nodeComponent={Delegate}
        nodeProps={{ ...nodeProps, nodeComponent }}
      />
    );
  };
};
