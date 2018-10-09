package com.gdssoft.oa.model.system;

import java.util.HashSet;
import java.util.Set;

import com.gdssoft.oa.model.archive.Archives;
import com.google.gson.annotations.Expose;

public class DocFiles extends com.gdssoft.core.model.BaseModel{
	/**
	 * 系统用户ID，由初始化数据加入
	 */
	public static Long SYSTEM_USER=-1L;
	/**
	 * 超级管理员ID,由初始化数据加入
	 */
	public static Long SUPER_USER=-1L;
	@Expose
	protected Long id;
	//标题
	@Expose
	protected String fileName;
	//文号
	@Expose
	protected String fileNo;
	//页数
	@Expose
	protected int pageCount;
	//文件类型 0发文 1收文
	@Expose
	protected int fileType;
	//责任人
	@Expose
	protected String dutyPerson;
	//密级
	@Expose
	protected String secretLevel;
	//文件日期
	@Expose
	protected java.util.Date fileDate;
	//年度
	@Expose
	protected String fileYear;
	//作者
	@Expose
	protected String createUser;
	//创建日期
	@Expose
	protected java.util.Date createDate;
	//最后修改人
	@Expose
	protected String updateUser;
	//最后修改日期
	@Expose
	protected java.util.Date updateDate;
	//文件档案目录
	@Expose
	protected DocDirectory docDirectory;
	//所属部门
	@Expose
	protected Department department;
	//公文原文
	@Expose
	protected Archives archives;
	//文件状态  0待归档 1已归档
	@Expose
	protected Short fileStatus;
	//备注
	@Expose
	protected String remark;
	//行号
	@Expose
	protected Long rowNumber;
	//件号
	@Expose
	protected Long fileNumber;
	//0:新数据，1:旧数据
	@Expose
	protected Long sourceType;
	//旧数据的责任者
	@Expose
	protected String fileIssup;
	//附件列表
	@Expose
	protected Set<FileAttach> fileList=new HashSet<FileAttach>();
	
	public DocFiles(Long id){this.setId(id);}
	public DocFiles(){super();}
	
	
	/**
	 * 弃用属性
	 */
	//保存期限  0永久 10十年  30三十年  1待分类
	protected int retentionYear;
	//保存日期
	protected java.util.Date retention;
	//文件大小
	protected Double totalBytes;
	
	
	
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public String getFileNo() {
		return fileNo;
	}
	public void setFileNo(String fileNo) {
		this.fileNo = fileNo;
	}
	public int getPageCount() {
		return pageCount;
	}
	public void setPageCount(int pageCount) {
		this.pageCount = pageCount;
	}
	public String getDutyPerson() {
		return dutyPerson;
	}
	public void setDutyPerson(String dutyPerson) {
		this.dutyPerson = dutyPerson;
	}

	public String getSecretLevel() {
		return secretLevel;
	}
	public void setSecretLevel(String secretLevel) {
		this.secretLevel = secretLevel;
	}
	public java.util.Date getFileDate() {
		return fileDate;
	}
	public void setFileDate(java.util.Date fileDate) {
		this.fileDate = fileDate;
	}
	public String getFileYear() {
		return fileYear;
	}
	public void setFileYear(String fileYear) {
		this.fileYear = fileYear;
	}
	public int getRetentionYear() {
		return retentionYear;
	}
	public void setRetentionYear(int retentionYear) {
		this.retentionYear = retentionYear;
	}
	public java.util.Date getRetention() {
		return retention;
	}
	public void setRetention(java.util.Date retention) {
		this.retention = retention;
	}
	public Double getTotalBytes() {
		return totalBytes;
	}
	public void setTotalBytes(Double totalBytes) {
		this.totalBytes = totalBytes;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
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
	public DocDirectory getDocDirectory() {
		return docDirectory;
	}
	public void setDocDirectory(DocDirectory docDirectory) {
		this.docDirectory = docDirectory;
	}
	public Department getDepartment() {
		return department;
	}
	public void setDepartment(Department department) {
		this.department = department;
	}
	public int getFileType() {
		return fileType;
	}
	public void setFileType(int fileType) {
		this.fileType = fileType;
	}
	public Short getFileStatus() {
		return fileStatus;
	}
	public void setFileStatus(Short fileStatus) {
		this.fileStatus = fileStatus;
	}
	public Archives getArchives() {
		return archives;
	}
	public void setArchives(Archives archives) {
		this.archives = archives;
	}
	public Set<FileAttach> getFileList() {
		return fileList;
	}
	public void setFileList(Set<FileAttach> fileList) {
		this.fileList = fileList;
	}
	public Long getRowNumber() {
		return rowNumber;
	}
	public void setRowNumber(Long rowNumber) {
		this.rowNumber = rowNumber;
	}
	public Long getFileNumber() {
		return fileNumber;
	}
	public void setFileNumber(Long fileNumber) {
		this.fileNumber = fileNumber;
	}
	public Long getSourceType() {
		return sourceType;
	}
	public void setSourceType(Long sourceType) {
		this.sourceType = sourceType;
	}
	public String getFileIssup() {
		return fileIssup;
	}
	public void setFileIssup(String fileIssup) {
		this.fileIssup = fileIssup;
	}
}
