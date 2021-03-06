package com.gdssoft.oa.model.system;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * SysArchivesFiles Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class SysArchivesFiles extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected Long fileType;
	protected Long fileVersion;
	protected String fileName;
	protected String filePath;
	protected String fileSize;
	protected Double fileByteSize;
	protected String fileExtType;
	protected java.util.Date fileDate;
	protected Short isFinish;
	protected com.gdssoft.oa.model.system.SysDataTransfer sysDataTransfer;


	/**
	 * Default Empty Constructor for class SysArchivesFiles
	 */
	public SysArchivesFiles () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class SysArchivesFiles
	 */
	public SysArchivesFiles (
		 Long in_id
        ) {
		this.setId(in_id);
    }

	
	public com.gdssoft.oa.model.system.SysDataTransfer getSysDataTransfer () {
		return sysDataTransfer;
	}	
	
	public void setSysDataTransfer (com.gdssoft.oa.model.system.SysDataTransfer in_sysDataTransfer) {
		this.sysDataTransfer = in_sysDataTransfer;
	}
    

	/**
	 * 	 * @return Long
     * @hibernate.id column="ID" type="java.lang.Long" generator-class="native"
	 */
	public Long getId() {
		return this.id;
	}
	
	/**
	 * Set the id
	 */	
	public void setId(Long aValue) {
		this.id = aValue;
	}	

	/**
	 * 	 * @return Long
	 */
	public Long getDataId() {
		return this.getSysDataTransfer()==null?null:this.getSysDataTransfer().getId();
	}
	
	/**
	 * Set the dataId
	 */	
	public void setDataId(Long aValue) {
	    if (aValue==null) {
	    	sysDataTransfer = null;
	    } else if (sysDataTransfer == null) {
	        sysDataTransfer = new com.gdssoft.oa.model.system.SysDataTransfer(aValue);
	        sysDataTransfer.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			sysDataTransfer.setId(aValue);
	    }
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="FILE_TYPE" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getFileType() {
		return this.fileType;
	}
	
	/**
	 * Set the fileType
	 */	
	public void setFileType(Long aValue) {
		this.fileType = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="FILE_VERSION" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getFileVersion() {
		return this.fileVersion;
	}
	
	/**
	 * Set the fileVersion
	 */	
	public void setFileVersion(Long aValue) {
		this.fileVersion = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="FILE_NAME" type="java.lang.String" length="200" not-null="false" unique="false"
	 */
	public String getFileName() {
		return this.fileName;
	}
	
	/**
	 * Set the fileName
	 */	
	public void setFileName(String aValue) {
		this.fileName = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="FILE_PATH" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getFilePath() {
		return this.filePath;
	}
	
	/**
	 * Set the filePath
	 */	
	public void setFilePath(String aValue) {
		this.filePath = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="FILE_SIZE" type="java.lang.String" length="100" not-null="false" unique="false"
	 */
	public String getFileSize() {
		return this.fileSize;
	}
	
	/**
	 * Set the fileSize
	 */	
	public void setFileSize(String aValue) {
		this.fileSize = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="FILE_BYTE_SIZE" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Double getFileByteSize() {
		return this.fileByteSize;
	}
	
	/**
	 * Set the fileByteSize
	 */	
	public void setFileByteSize(Double aValue) {
		this.fileByteSize = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="FILE_EXT_TYPE" type="java.lang.String" length="20" not-null="false" unique="false"
	 */
	public String getFileExtType() {
		return this.fileExtType;
	}
	
	/**
	 * Set the fileExtType
	 */	
	public void setFileExtType(String aValue) {
		this.fileExtType = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="FILE_DATE" type="java.util.Date" length="7" not-null="false" unique="false"
	 */
	public java.util.Date getFileDate() {
		return this.fileDate;
	}
	
	/**
	 * Set the fileDate
	 */	
	public void setFileDate(java.util.Date aValue) {
		this.fileDate = aValue;
	}	
	
	

	/**
	 * @return the isFinish
	 */
	public Short getIsFinish() {
		return isFinish;
	}

	/**
	 * @param isFinish the isFinish to set
	 */
	public void setIsFinish(Short isFinish) {
		this.isFinish = isFinish;
	}

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof SysArchivesFiles)) {
			return false;
		}
		SysArchivesFiles rhs = (SysArchivesFiles) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
						.append(this.fileType, rhs.fileType)
				.append(this.fileVersion, rhs.fileVersion)
				.append(this.fileName, rhs.fileName)
				.append(this.filePath, rhs.filePath)
				.append(this.fileSize, rhs.fileSize)
				.append(this.fileByteSize, rhs.fileByteSize)
				.append(this.fileExtType, rhs.fileExtType)
				.append(this.fileDate, rhs.fileDate)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.id) 
						.append(this.fileType) 
				.append(this.fileVersion) 
				.append(this.fileName) 
				.append(this.filePath) 
				.append(this.fileSize) 
				.append(this.fileByteSize) 
				.append(this.fileExtType) 
				.append(this.fileDate) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("id", this.id) 
						.append("fileType", this.fileType) 
				.append("fileVersion", this.fileVersion) 
				.append("fileName", this.fileName) 
				.append("filePath", this.filePath) 
				.append("fileSize", this.fileSize) 
				.append("fileByteSize", this.fileByteSize) 
				.append("fileExtType", this.fileExtType) 
				.append("fileDate", this.fileDate) 
				.toString();
	}



}
