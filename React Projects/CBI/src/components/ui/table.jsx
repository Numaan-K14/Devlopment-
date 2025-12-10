import * as React from "react";

import { cn } from "@/lib/utils";

function Table({ className, ...props }) {
  return (
    <div data-slot="table-container">
      <table data-slot="table" className={cn(className)} {...props} />
    </div>
  );
}

function TableHeader({ className, ...props }) {
  return (
    <thead data-slot="table-header" className={cn(className)} {...props} />
  );
}

function TableBody({ className, ...props }) {
  return <tbody data-slot="table-body" className={cn(className)} {...props} />;
}

function TableFooter({ className, ...props }) {
  return (
    <tfoot data-slot="table-footer" className={cn(className)} {...props} />
  );
}

function TableRow({ className, ...props }) {
  return <tr data-slot="table-row" className={cn(className)} {...props} />;
}

function TableHead({ className, ...props }) {
  return <th data-slot="table-head" className={cn(className)} {...props} />;
}

function TableCell({ className, ...props }) {
  return <td data-slot="table-cell" className={cn(className)} {...props} />;
}

function TableCaption({ className, ...props }) {
  return (
    <caption data-slot="table-caption" className={cn(className)} {...props} />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
