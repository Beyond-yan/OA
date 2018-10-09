package com.gdssoft.oa.model.system;

public class DocDirectory extends com.gdssoft.core.model.BaseModel{
	/**
	 * 系统用户ID，由初始化数据加入
	 */
	public static Long SYSTEM_USER=-1L;
	/**
	 * 超级管理员ID,由初始化数据加入
	 */
	public static Long SUPER_USER=-1L;
	private Long id;
	//题名
	private String directoryName;
	//父ID
	private Long parentId;
	//所属部门
	private Department department;
	//年份
	private int dirYear;
	//有效期  0永久 1待分类  10十年  30三十年
	private java.util.Date retention;
	//是否发文目录 0发文 1收文
	private int isSendDir;
	
	private int orderNo;
	//创建人
	private String createUser;
	//创建日期
	private java.util.Date createDate;
	//最后修改人
	private String updateUser;
	//最后修改日期
	private java.util.Date updateDate;
	//保管期限
	private int retentionYear;
    //件起号
	private Long startFileNo;
	//件止号
	private Long endFileNo;
	//文件数量
	private Integer fileAmount;
	//是否生成件号
	private Integer isMakeFileNumber;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getDirectoryName() {
		return directoryName;
	}
	public void setDirectoryName(String directoryName) {
		this.directoryName = directoryName;
	}
	public Long getParentId() {
		return parentId;
	}
	public void setParentId(Long parentId) {
		this.parentId = parentId;
	}

	public int getDirYear() {
		return dirYear;
	}
	public void setDirYear(int dirYear) {
		this.dirYear = dirYear;
	}
	public java.util.Date getRetention() {
		return retention;
	}
	public void setRetention(java.util.Date retention) {
		this.retention = retention;
	}

	public int getIsSendDir() {
		return isSendDir;
	}
	public void setIsSendDir(int isSendDir) {
		this.isSendDir = isSendDir;
	}
	public int getOrderNo() {
		return orderNo;
	}
	public void setOrderNo(int orderNo) {
		this.orderNo = orderNo;
	}
	public String getCreateUser() {
		return createUser;
	}
	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}
	public java.util.Date getCreateDate() {
		return createDate;
	}
	public void setCreateDate(java.util.Date createDate) {
		this.createDate = createDate;
	}
	public String getUpdateUser() {
		return updateUser;
	}
	public void setUpdateUser(String updateUser) {
		this.updateUser = updateUser;
	}
	public java.util.Date getUpdateDate() {
		return updateDate;
	}
	public void setUpdateDate(java.util.Date updateDate) {
		this.updateDate = updateDate;
	}
	public int getRetentionYear() {
		return retentionYear;
	}
	public void setRetentionYear(int retentionYear) {
		this.retentionYear = retentionYear;
	}
	public Department getDepartment() {
		return department;
	}
	public void setDepartment(Department department) {
		this.department = department;
	}
	public Long getStartFileNo() {
		return startFileNo;
	}
	public void setStartFileNo(Long startFileNo) {
		this.startFileNo = startFileNo;
	}
	public Long getEndFileNo() {
		return endFileNo;
	}
	public void setEndFileNo(Long endFileNo) {
		this.endFileNo = endFileNo;
	}
	public Integer getFileAmount() {
		return fileAmount;
	}
	public void setFileAmount(Integer fileAmount) {
		this.fileAmount = fileAmount;
	}
	public Integer getIsMakeFileNumber() {
		return isMakeFileNumber;
	}
	public void setIsMakeFileNumber(Integer isMakeFileNumber) {
		this.isMakeFileNumber = isMakeFileNumber;
	}
}
