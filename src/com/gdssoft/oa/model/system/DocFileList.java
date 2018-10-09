package com.gdssoft.oa.model.system;

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;

public class DocFileList extends com.gdssoft.core.model.BaseModel{
	/**
	 * 系统用户ID，由初始化数据加入
	 */
	public static Long SYSTEM_USER=-1L;
	/**
	 * 超级管理员ID,由初始化数据加入
	 */
	public static Long SUPER_USER=-1L;
	private Long id;
//	private Long fileId;
//	private Long attachId;
	private int downloads;
	private String fileSummary;
	private String createUser;
	private java.util.Date createDate;
	protected com.gdssoft.oa.model.system.DocFiles docFiles;
	protected com.gdssoft.oa.model.system.FileAttach fileAttach;
	
	public Long getAttachId() {
		return getFileAttach().getFileId();
	}

	public void setAttachId(Long aValue) {
	    if (aValue==null) {
	    	fileAttach = null;
	    } else if (fileAttach == null) {
	    	fileAttach = new com.gdssoft.oa.model.system.FileAttach(aValue);
	    	fileAttach.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
	    	fileAttach.setFileId(aValue);
	    }
	}
	
	/**
	 * 卷内文件ID	 * @return Long
	 */
	public Long getFileId() {
		return this.getDocFiles()==null?null:this.getDocFiles().getId();
	}
	
	/**
	 * Set the rollFileId
	 */	
	public void setFileId(Long aValue) {
	    if (aValue==null) {
	    	docFiles = null;
	    } else if (docFiles == null) {
	        docFiles = new com.gdssoft.oa.model.system.DocFiles(aValue);
	        docFiles.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			docFiles.setId(aValue);
	    }
	}	
	
	/**
	 * Set the rollFileId
	 */	
	public com.gdssoft.oa.model.system.DocFiles getDocFiles() {
		return docFiles;
	}
	public void setDocFiles(com.gdssoft.oa.model.system.DocFiles docFiles) {
		this.docFiles = docFiles;
	}
	public com.gdssoft.oa.model.system.FileAttach getFileAttach() {
		return fileAttach;
	}
	public void setFileAttach(com.gdssoft.oa.model.system.FileAttach fileAttach) {
		this.fileAttach = fileAttach;
	}
//	public Long getFileId() {
//		return fileId;
//	}
//	public void setFileId(Long fileId) {
//		this.fileId = fileId;
//	}
//	public Long getAttachId() {
//		return attachId;
//	}
//	public void setAttachId(Long attachId) {
//		this.attachId = attachId;
//	}
	public int getDownloads() {
		return downloads;
	}
	public void setDownloads(int downloads) {
		this.downloads = downloads;
	}
	public String getFileSummary() {
		return fileSummary;
	}
	public void setFileSummary(String fileSummary) {
		this.fileSummary = fileSummary;
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
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof DocFileList)) {
			return false;
		}
		DocFileList dhs = (DocFileList) object;
		return new EqualsBuilder()
				.append(this.downloads, dhs.downloads)
				.append(this.id, dhs.id)
				.append(this.fileSummary, dhs.fileSummary)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.downloads) 
				.append(this.id) 
				.append(this.fileSummary) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("downLoads", this.downloads) 
				.append("id", this.id) 
				.append("fileSummary", this.fileSummary) 
				.toString();
	}
}
