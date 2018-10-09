package com.gdssoft.oa.model.integration;

import com.google.gson.annotations.Expose;

public class BaseModel {
	@Expose
	private int rowNo;
	@Expose
	private int pageIndex;
	@Expose
	private int pageSize;
	@Expose
	private long totalCount;
	@Expose
	private int pageCount;
	
	public int getRowNo() {
		return rowNo;
	}
	public void setRowNo(int rowNo) {
		this.rowNo = rowNo;
	}
	public int getPageIndex() {
		return pageIndex;
	}
	public int getPageSize() {
		return pageSize;
	}
	public long getTotalCount() {
		return totalCount;
	}
	public int getPageCount() {
		return pageCount;
	}
	
	public void setPagingInfo(int pageIndex, int pageSize, long totalCount) {
		
		this.pageSize = pageSize;
		this.totalCount = totalCount;
		
		this.pageCount = (int) (totalCount / pageSize + ((totalCount
				% pageSize == 0L) ? 0 : 1));
		
		if(pageIndex < this.pageCount) {
			this.pageIndex = pageIndex;
		} else {
			this.pageIndex = 0;
		}
	}
}
