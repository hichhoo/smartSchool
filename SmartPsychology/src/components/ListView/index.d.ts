import * as React from 'react';

export interface IListViewProps {
  onLoadMore: (pageObj: { pageNo, pageSize }) => {},
  pageSize?: number,
}

export default class ListView extends React.Component<IListViewProps, any> {
}
