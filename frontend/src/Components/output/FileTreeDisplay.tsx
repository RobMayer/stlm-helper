import { useState, useCallback } from "react";
import FileTree from "../../Utility/tree/filetree";
import { extendTreeDisplay, IExtendedNodeHandler, TreeNodeProps } from "./TreeDisplay";

type Folding = {
  isExpanded: boolean;
  toggle: () => void;
};

const FileNodeHandler = <E extends Object>({
  nodeComponent: NodeComponent,
  tree,
  nodeId,
  depth,
  ...rest
}: IExtendedNodeHandler<FileTree, Folding & E>) => {
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

const FileTreeDisplay = extendTreeDisplay<FileTree, Folding>(FileNodeHandler);

export type FileTreeNodeProps<T extends Object> = TreeNodeProps<FileTree> & Folding & T;

export default FileTreeDisplay;
