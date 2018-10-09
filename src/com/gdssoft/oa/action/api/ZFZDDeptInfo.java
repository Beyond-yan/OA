package com.gdssoft.oa.action.api;

public class ZFZDDeptInfo {

	private long deptId;
	private long parentId;
	private String deptName;
	private String depUnitCode;
	private Integer depLevel;
	private String path;
	private Integer isExternal;
	
	public long getDeptId() {
		return deptId;
	}
	public void setDeptId(long deptId) {
		this.deptId = deptId;
	}
	public long getParentId() {
		return parentId;
	}
	public void setParentId(long parentId) {
		this.parentId = parentId;
	}
	public String getDeptName() {
		return deptName;
	}
	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public String getDepUnitCode() {
		return depUnitCode;
	}
	public void setDepUnitCode(String depUnitCode) {
		this.depUnitCode = depUnitCode;
	}
	public Integer getDepLevel() {
		return depLevel;
	}
	public void setDepLevel(Integer depLevel) {
		this.depLevel = depLevel;
	}
	public Integer getIsExternal() {
		return isExternal;
	}
	public void setIsExternal(Integer isExternal) {
		this.isExternal = isExternal;
	}
	
}
