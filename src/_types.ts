import React from "react";

export type RenderFnc<Props> = (Props: Props) => React.ReactElement;
export type AnyComponent<Props> = React.FC<Props>;
