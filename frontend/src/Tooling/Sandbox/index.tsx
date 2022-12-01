import { useCallback, useMemo, useState } from "react";
import TreeDisplay, { TreeNodeProps } from "../../Components/output/TreeDisplay";
import FileTree from "../../Utility/tree/filetree";

type TempProps = {
  somethingElse: string;
};

const FileNode = ({
  tree,
  nodeId,
  depth,
  somethingElse,
  name,
  nodeComponent: NodeComponent,
  className,
}: TreeNodeProps<FileTree, TempProps> & { className?: string }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const toggle = useCallback(() => {
    setIsExpanded((p) => !p);
  }, []);

  const entry = tree.get(nodeId);
  return (
    <div className={className}>
      <div>{name ?? entry.name}</div>
      <div>{somethingElse}</div>
      {entry.children.map((each) => {
        return (
          <NodeComponent
            key={each}
            tree={tree}
            nodeId={each}
            nodeComponent={NodeComponent}
            somethingElse={somethingElse}
            depth={[...depth, true]}
          />
        );
      })}
    </div>
  );
};

const Sandbox = () => {
  const tree = useMemo(() => {
    return FileTree.fromList(["/C:/test/alpha/bravo.png", "/C:/test/alpha/gamma.png"]);
  }, []);

  return (
    <>
      <TreeDisplay<FileTree, TempProps> tree={tree} nodeComponent={FileNode} nodeProps={{ somethingElse: "hi" }} />
    </>
  );
};

export default Sandbox;
