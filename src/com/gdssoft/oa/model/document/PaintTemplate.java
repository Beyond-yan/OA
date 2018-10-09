package com.gdssoft.oa.model.document;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * PaintTemplate Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * TODO: add class/table comments
 */
public class PaintTemplate extends com.gdssoft.core.model.BaseModel {

    protected Long ptemplateId;
	protected String templateName;
	protected String path;
	protected Short isActivate;
	protected com.gdssoft.oa.model.system.FileAttach fileAttach;


	/**
	 * Default Empty Constructor for class PaintTemplate
	 */
	public PaintTemplate () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class PaintTemplate
	 */
	public PaintTemplate (
		 Long in_ptemplateId
        ) {
		this.setPtemplateId(in_ptemplateId);
    }

	
	public com.gdssoft.oa.model.system.FileAttach getFileAttach () {
		return fileAttach;
	}	
	
	public void setFileAttach (com.gdssoft.oa.model.system.FileAttach in_fileAttach) {
		this.fileAttach = in_fileAttach;
	}
    

	/**
	 * 	 * @return Long
     * @hibernate.id column="ptemplateId" type="java.lang.Long" generator-class="native"
	 */
	public Long getPtemplateId() {
		return this.ptemplateId;
	}
	
	/**
	 * Set the ptemplateId
	 */	
	public void setPtemplateId(Long aValue) {
		this.ptemplateId = aValue;
	}	

	/**
	 * 	 * @return Long
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
	 * 	 * @return String
	 * @hibernate.property column="templateName" type="java.lang.String" length="64" not-null="true" unique="false"
	 */
	public String getTemplateName() {
		return this.templateName;
	}
	
	/**
	 * Set the templateName
	 * @spring.validator type="required"
	 */	
	public void setTemplateName(String aValue) {
		this.templateName = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="path" type="java.lang.String" length="128" not-null="true" unique="false"
	 */
	public String getPath() {
		return this.path;
	}
	
	/**
	 * Set the path
	 * @spring.validator type="required"
	 */	
	public void setPath(String aValue) {
		this.path = aValue;
	}	

	/**
	 * 	 * @return Short
	 * @hibernate.property column="isActivate" type="java.lang.Short" length="5" not-null="true" unique="false"
	 */
	public Short getIsActivate() {
		return this.isActivate;
	}
	
	/**
	 * Set the isActivate
	 * @spring.validator type="required"
	 */	
	public void setIsActivate(Short aValue) {
		this.isActivate = aValue;
	}	

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof PaintTemplate)) {
			return false;
		}
		PaintTemplate rhs = (PaintTemplate) object;
		return new EqualsBuilder()
				.append(this.ptemplateId, rhs.ptemplateId)
						.append(this.templateName, rhs.templateName)
				.append(this.path, rhs.path)
				.append(this.isActivate, rhs.isActivate)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.ptemplateId) 
						.append(this.templateName) 
				.append(this.path) 
				.append(this.isActivate) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("ptemplateId", this.ptemplateId) 
						.append("templateName", this.templateName) 
				.append("path", this.path) 
				.append("isActivate", this.isActivate) 
				.toString();
	}



}
