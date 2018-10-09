package com.gdssoft.oa.model.archive;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

import com.google.gson.annotations.Expose;

/**
 * ArchRecType Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * TODO: add class/table comments
 */
public class ArchRecType extends com.gdssoft.core.model.BaseModel {

    @Expose
	protected Long recTypeId;
    @Expose
	protected String typeName;
    @Expose
	protected com.gdssoft.oa.model.system.Department department;
	protected java.util.Set archivesDeps = new java.util.HashSet();
    
	protected java.util.Set archives=new java.util.HashSet();
	/**
	 * Default Empty Constructor for class Archtype
	 */
	public ArchRecType () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class Archtype
	 */
	public ArchRecType (
		 Long in_typeId
        ) {
		this.setRecTypeId(in_typeId);
    }

	
	
	public java.util.Set getArchives() {
		return archives;
	}

	public void setArchives(java.util.Set archives) {
		this.archives = archives;
	}

	public com.gdssoft.oa.model.system.Department getDepartment () {
		return department;
	}	
	
	public void setDepartment (com.gdssoft.oa.model.system.Department in_department) {
		this.department = in_department;
	}

	public java.util.Set getArchivesDeps () {
		return archivesDeps;
	}	
	
	public void setArchivesDeps (java.util.Set in_archivesDeps) {
		this.archivesDeps = in_archivesDeps;
	}
    

	/**
	 * 	 * @return Long
     * @hibernate.id column="typeId" type="java.lang.Long" generator-class="native"
	 */
	public Long getRecTypeId() {
		return this.recTypeId;
	}
	
	/**
	 * Set the typeId
	 */	
	public void setRecTypeId(Long aValue) {
		this.recTypeId = aValue;
	}	

	/**
	 * 分类名称	 * @return String
	 * @hibernate.property column="typeName" type="java.lang.String" length="128" not-null="true" unique="false"
	 */
	public String getTypeName() {
		return this.typeName;
	}
	
	/**
	 * Set the typeName
	 * @spring.validator type="required"
	 */	
	public void setTypeName(String aValue) {
		this.typeName = aValue;
	}	

	/**
	 * 	 * @return Long
	 */
	public Long getDepId() {
		return this.getDepartment()==null?null:this.getDepartment().getDepId();
	}
	
	/**
	 * Set the depId
	 */	
	public void setDepId(Long aValue) {
	    if (aValue==null) {
	    	department = null;
	    } else if (department == null) {
	        department = new com.gdssoft.oa.model.system.Department(aValue);
	        department.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			department.setDepId(aValue);
	    }
	}	

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof ArchRecType)) {
			return false;
		}
		ArchRecType rhs = (ArchRecType) object;
		return new EqualsBuilder()
				.append(this.recTypeId, rhs.recTypeId)
				.append(this.typeName, rhs.typeName)
						.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.recTypeId) 
				.append(this.typeName) 
						.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("typeId", this.recTypeId) 
				.append("typeName", this.typeName) 
						.toString();
	}



}
