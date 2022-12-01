import { useState, useCallback } from "react";
import FileTree from "../../../Utility/tree/filetree";
import { extendTree, TreeNodeProps, TreeNodeRenderer } from "./BaseTreeDisplay";

type FoldProps = {
  isExpanded: boolean;
  toggle: () => void;
};

const FileEntryHandler = <E extends Object>({
  nodeComponent: NodeComponent,
  tree,
  nodeId,
  depth,
  ...rest
}: TreeNodeProps<FileTree> & TreeNodeRenderer<FileTree, FoldProps & E>) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const toggle = useCallback(() => {
    setIsExpanded((p) => !p);
  }, []);

  return (
    <>
      <NodeComponent
        isExpanded={isExpanded}
        toggle={toggle}
        tree={tree}
        depth={depth}
        nodeId={nodeId}
        {...((rest ?? {}) as E)}
      />
    </>
  );
};

const FileTreeDisplay = extendTree<FileTree, FoldProps>(FileEntryHandler);

export default FileTreeDisplay;

export type FileTreeNodeProps<E extends Object> = TreeNodeProps<FileTree> & FoldProps & E;
