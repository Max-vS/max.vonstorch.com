import React from "react";
import { cn } from "@/lib/utils";

export const SectionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 md:p-3", className)} {...props} />
));
SectionContent.displayName = "SectionContent";

export const SectionHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "p-5 md:p-3 font-medium text-lg md:text-sm flex items-start justify-start md:justify-end md:border-r border-molten",
      className,
    )}
    {...props}
  />
));
SectionHeader.displayName = "SectionHeader";

export const Section = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const getDisplayName = (child: React.ReactNode) =>
    React.isValidElement(child) &&
    typeof child.type !== "string" &&
    "displayName" in child.type
      ? child.type.displayName
      : null;

  const childArray = React.Children.toArray(children);
  const header = childArray.find((c) => getDisplayName(c) === "SectionHeader");
  const contents = childArray.filter(
    (c) => getDisplayName(c) === "SectionContent",
  );
  const others = childArray.filter(
    (c) =>
      getDisplayName(c) !== "SectionHeader" &&
      getDisplayName(c) !== "SectionContent",
  );

  const processedContents =
    contents.length > 1
      ? contents.map((child, i) =>
          React.isValidElement(child) && i < contents.length - 1
            ? React.cloneElement(
                child as React.ReactElement<
                  React.HTMLAttributes<HTMLDivElement>
                >,
                {
                  className: cn(
                    (child.props as React.HTMLAttributes<HTMLDivElement>)
                      .className,
                    "border-b border-dotted border-molten",
                  ),
                },
              )
            : child,
        )
      : contents;

  return (
    <section
      className={cn(
        "flex flex-col md:grid w-full border-b border-molten text-molten text-sm",
        className,
      )}
      style={{ gridTemplateColumns: "12rem 28rem 1fr" }}
    >
      {header || <SectionHeader />}
      <div className="md:border-r border-molten">
        {processedContents.length > 0 ? processedContents : others}
      </div>
      <div className="hidden md:block" />
    </section>
  );
};
Section.displayName = "Section";
