import { Component, HTMLAttributes, useCallback } from "react";
import AbstractTree from "../../Utility/tree/abstract";

export type TreeNodeProps<T extends AbstractTree<any>> = {
  tree: T;
  nodeId: string;
  depth: boolean[];
  name?: string;
};

type TreeNodeRenderer<T extends AbstractTree<any>, M extends Object> = {
  nodeComponent: ((props: TreeNodeProps<T> & M) => JSX.Element) | typeof Component<TreeNodeProps<T> & M, any>;
};

type TreeNodeDelegator<M extends Object> = {
  nodeProps: M;
};

type BaseTreeProps<T extends AbstractTree<any>> = {
  tree: T;
  showRoot?: boolean;
  rootName?: string;
};

export type TreeDisplayProps<T extends AbstractTree<any>, M extends Object> = BaseTreeProps<T> &
  TreeNodeRenderer<T, M> &
  TreeNodeDelegator<M>;

const TreeDisplay = <T extends AbstractTree<any>, M extends Object>({
  tree,
  nodeProps,
  nodeComponent: NodeComponent,
  showRoot = false,
  rootName,
  ...props
}: TreeDisplayProps<T, M> & HTMLAttributes<HTMLDivElement>) => {
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

export default TreeDisplay;

/* for Building new TreeDisplays */

export type IExtendedNodeHandler<T extends AbstractTree<any>, E extends Object> = TreeNodeProps<T> &
  TreeNodeRenderer<T, E>;

export const extendTreeDisplay = <T extends AbstractTree<any>, N extends Object>(
  NodeHandler: <E extends Object>(p: TreeNodeProps<T> & TreeNodeRenderer<T, N & E>) => JSX.Element
) => {
  return <E extends Object>({
    tree,
    nodeComponent,
    nodeProps,
  }: BaseTreeProps<T> & TreeNodeRenderer<T, N & E> & TreeNodeDelegator<E>) => {
    const Delegate = useCallback(({ nodeComponent: nC, ...p }: TreeNodeProps<T> & TreeNodeRenderer<T, N & E>) => {
      return <NodeHandler<E> {...p} nodeComponent={nC} />;
    }, []);

    return (
      <TreeDisplay<T, TreeNodeRenderer<T, N & E>>
        tree={tree}
        nodeComponent={Delegate}
        nodeProps={{ ...nodeProps, nodeComponent }}
      />
    );
  };
};
