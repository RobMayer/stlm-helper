import { Component, HTMLAttributes, useCallback } from "react";
import AbstractTree from "../../Utility/tree/abstract";

export type TreeNodeProps<T extends AbstractTree<any>, M extends Object = {}> = M & {
  tree: T;
  nodeId: string;
  depth: boolean[];
  name?: string;
} & TreeNodeRenderer<T, M>;

type TreeNodeRenderer<T extends AbstractTree<any>, M extends Object> = {
  nodeComponent:
    | ((props: TreeNodeProps<T, M> & M & TreeNodeRenderer<T, M>) => JSX.Element)
    | typeof Component<TreeNodeProps<T, M> & M & TreeNodeRenderer<T, M>, any>;
};

export type TreeDisplayProps<T extends AbstractTree<any>, M extends Object = never> = {
  tree: T;
  showRoot?: boolean;
  rootName?: string;
} & ([M] extends [never] ? { nodeProps?: M } : { nodeProps: M }) &
  TreeNodeRenderer<T, M>;

const TreeDisplay = <T extends AbstractTree<any>, M extends Object = never>({
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
        <NodeComponent
          {...((nodeProps ?? {}) as M)}
          tree={tree}
          nodeId={tree.root()}
          depth={[]}
          name={rootName}
          nodeComponent={NodeComponent}
        />
      ) : (
        tree.get(tree.root()).children.map((childKey: string) => {
          return (
            <NodeComponent
              {...((nodeProps ?? {}) as M)}
              key={childKey}
              tree={tree}
              depth={[]}
              nodeId={childKey}
              nodeComponent={NodeComponent}
            />
          );
        })
      )}
    </div>
  );
};

export default TreeDisplay;
