package com.gdssoft.oa.model.archive;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;

/**
 * ArchTemplate Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * ������������
 */
public class ArchTemplate extends com.gdssoft.core.model.BaseModel {

    protected Long templateId;
	protected String tempName;
	protected String tempPath;
	protected com.gdssoft.oa.model.system.FileAttach fileAttach;
	protected com.gdssoft.oa.model.archive.ArchivesType archivesType;
	protected AppUser appUser;
	protected String userName;
	protected Department department;
	protected String depName;
	protected String password;
	protected Long isGenre;

	
	public Long getIsGenre() {
		return isGenre;
	}

	public void setIsGenre(Long isGenre) {
		this.isGenre = isGenre;
	}

	public AppUser getAppUser() {
		return appUser;
	}

	public void setAppUser(AppUser appUser) {
		this.appUser = appUser;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public Department getDepartment() {
		return department;
	}

	public void setDepartment(Department department) {
		this.department = department;
	}

	public String getDepName() {
		return depName;
	}

	public void setDepName(String depName) {
		this.depName = depName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	/**
	 * Default Empty Constructor for class ArchTemplate
	 */
	public ArchTemplate () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class ArchTemplate
	 */
	public ArchTemplate (
		 Long in_templateId
        ) {
		this.setTemplateId(in_templateId);
    }

	
	public com.gdssoft.oa.model.system.FileAttach getFileAttach () {
		return fileAttach;
	}	
	
	public void setFileAttach (com.gdssoft.oa.model.system.FileAttach in_fileAttach) {
		this.fileAttach = in_fileAttach;
	}
	
	public com.gdssoft.oa.model.archive.ArchivesType getArchivesType () {
		return archivesType;
	}	
	
	public void setArchivesType (com.gdssoft.oa.model.archive.ArchivesType in_archivesType) {
		this.archivesType = in_archivesType;
	}
    

	/**
	 * 	 * @return Long
     * @hibernate.id column="templateId" type="java.lang.Long" generator-class="native"
	 */
	public Long getTemplateId() {
		return this.templateId;
	}
	
	/**
	 * Set the templateId
	 */	
	public void setTemplateId(Long aValue) {
		this.templateId = aValue;
	}	

	/**
	 * 所属类型	 * @return Long
	 */
	public Long getTypeId() {
		return this.getArchivesType()==null?null:this.getArchivesType().getTypeId();
	}
	
	/**
	 * Set the typeId
	 */	
	public void setTypeId(Long aValue) {
	    if (aValue==null) {
	    	archivesType = null;
	    } else if (archivesType == null) {
	        archivesType = new com.gdssoft.oa.model.archive.ArchivesType(aValue);
	        archivesType.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			archivesType.setTypeId(aValue);
	    }
	}	

	/**
	 * 模板名称	 * @return String
	 * @hibernate.property column="tempName" type="java.lang.String" length="128" not-null="true" unique="false"
	 */
	public String getTempName() {
		return this.tempName;
	}
	
	/**
	 * Set the tempName
	 * @spring.validator type="required"
	 */	
	public void setTempName(String aValue) {
		this.tempName = aValue;
	}	

	/**
	 * 路径	 * @return String
	 * @hibernate.property column="tempPath" type="java.lang.String" length="256" not-null="true" unique="false"
	 */
	public String getTempPath() {
		return this.tempPath;
	}
	
	/**
	 * Set the tempPath
	 * @spring.validator type="required"
	 */	
	public void setTempPath(String aValue) {
		this.tempPath = aValue;
	}	

	/**
	 * 文件ID	 * @return Long
	 */
	public Long getFileId() {
		return this.getFileAttach()==null?null:this.getFileAttach().getFileId();
	}
	
	/**
	 * Set the fileId
	 */	
	public void setFileId(Long aValue) {
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
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof ArchTemplate)) {
			return false;
		}
		ArchTemplate rhs = (ArchTemplate) object;
		return new EqualsBuilder()
				.append(this.templateId, rhs.templateId)
						.append(this.tempName, rhs.tempName)
				.append(this.tempPath, rhs.tempPath)
						.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.templateId) 
						.append(this.tempName) 
				.append(this.tempPath) 
						.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("templateId", this.templateId) 
						.append("tempName", this.tempName) 
				.append("tempPath", this.tempPath) 
						.toString();
	}



}
