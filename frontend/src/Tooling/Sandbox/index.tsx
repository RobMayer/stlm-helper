import { useMemo } from "react";
import FileTreeDisplay from "../../Components/output/FileTreeDisplay";
import { FileTreeNodeProps } from "../../Components/output/FileTreeDisplay";
import FileTree from "../../Utility/tree/filetree";

type TempProps = {
  somethingElse: string;
};

const FileNode = ({ tree, nodeId, somethingElse, isExpanded, toggle, name }: FileTreeNodeProps<TempProps>) => {
  const entry = tree.get(nodeId);
  return <>{name ?? entry.name}</>;
};

const Sandbox = () => {
  const tree = useMemo(() => {
    return FileTree.fromList(["/C:/test/alpha/bravo.png", "/C:/test/alpha/gamma.png"]);
  }, []);

  return <FileTreeDisplay<TempProps> tree={tree} nodeComponent={FileNode} nodeProps={{ somethingElse: "hi" }} />;
};

export default Sandbox;
