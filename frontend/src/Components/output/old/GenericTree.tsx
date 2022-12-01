import { Component, HTMLAttributes, useState } from "react";
import AbstractTree from "../../../Utility/tree/abstract";
import FileTree from "../../../Utility/tree/filetree";

/* GENERIC BITS */

type ITreeProps<T extends AbstractTree<any>, M extends Object = never> = {
  tree: T;
  nodeComponent: ((props: INodeProps<T, M>) => JSX.Element) | typeof Component<INodeProps<T, M>, any>;
  showRoot?: boolean;
  rootName?: string;
} & ([M] extends [never] ? { nodeProps?: never } : { nodeProps: M });

type INodeProps<T extends AbstractTree<any>, M extends Object = {}> = M & {
  tree: T;
  depth: boolean[];
  nodeId: string;
  name?: string;
};

const TreeDisplay = <T extends AbstractTree<any>, M extends Object = never>({
  tree,
  nodeComponent: NodeComponent,
  nodeProps,
  showRoot,
  rootName,
  ...props
}: ITreeProps<T, M> & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props}>
      {showRoot ? (
        <NodeComponent {...(nodeProps ?? ({} as M))} depth={[]} nodeId={tree.root()} tree={tree} name={rootName} />
      ) : (
        tree.get(tree.root()).children.map((childKey: string) => {
          <NodeComponent {...(nodeProps ?? ({} as M))} key={childKey} depth={[]} nodeId={childKey} tree={tree} />;
        })
      )}
    </div>
  );
};

/* EXAMPLE USAGE */

type MyNodeProps = {
  onSelect: (key: string) => void;
};

const TestNode = ({ depth, nodeId, tree, name, onSelect }: INodeProps<FileTree, MyNodeProps>) => {
  const entry = tree.get(nodeId);
  return (
    <>
      <span
        onClick={() => {
          onSelect(nodeId);
        }}
      >
        {entry.isFolder ? "Folder: " : "File: "}
        {name ?? entry.name}
      </span>
      {entry.children.length > 0 &&
        entry.children.map((childKey) => {
          return (
            <TestNode key={childKey} depth={[...depth, false]} nodeId={childKey} tree={tree} onSelect={onSelect} />
          );
        })}
    </>
  );
};

const TestTreeDisplay = () => {
  const [someState, setSomeState] = useState("");
  const fTree = new FileTree("/", { isFolder: true, name: "root" });
  return (
    <>
      <span>The current key is {someState}</span>
      <TreeDisplay<FileTree, MyNodeProps>
        tree={fTree}
        nodeComponent={TestNode}
        nodeProps={{
          onSelect: (key: string) => {
            setSomeState(key);
          },
        }}
      />
      ;
    </>
  );
};
