package com.gdssoft.oa.model.flow;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

import com.google.gson.annotations.Expose;

/**
 * FormDef Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * TODO: add class/table comments
 */
public class FormDef extends com.gdssoft.core.model.BaseModel {
	/**
	 * 缺省列数
	 */
	public final static Integer DEFAULT_COLUMNS=1;

	@Expose
    protected Long formDefId;
	@Expose
	protected String formName;
	@Expose
	protected Integer columns;
	@Expose
	protected Short isEnabled;
	@Expose
	protected String activityName;
	
	@Expose
	protected String extDef;
	
	@Expose
	protected String deployId;

	/**
	 * Default Empty Constructor for class FormDef
	 */
	public FormDef () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class FormDef
	 */
	public FormDef (
		 Long in_formDefId
        ) {
		this.setFormDefId(in_formDefId);
    }


	public String getExtDef() {
		return extDef;
	}

	public void setExtDef(String extDef) {
		this.extDef = extDef;
	}

	/**
	 * 	 * @return Long
     * @hibernate.id column="formDefId" type="java.lang.Long" generator-class="native"
	 */
	public Long getFormDefId() {
		return this.formDefId;
	}
	
	/**
	 * Set the formDefId
	 */	
	public void setFormDefId(Long aValue) {
		this.formDefId = aValue;
	}	

	/**
	 * 表单名称	 * @return String
	 * @hibernate.property column="formName" type="java.lang.String" length="128" not-null="true" unique="false"
	 */
	public String getFormName() {
		return this.formName;
	}
	
	/**
	 * Set the formName
	 * @spring.validator type="required"
	 */	
	public void setFormName(String aValue) {
		this.formName = aValue;
	}	

	/**
	 * 总列数	 * @return Integer
	 * @hibernate.property column="columns" type="java.lang.Integer" length="10" not-null="true" unique="false"
	 */
	public Integer getColumns() {
		return this.columns;
	}
	
	/**
	 * Set the columns
	 * @spring.validator type="required"
	 */	
	public void setColumns(Integer aValue) {
		this.columns = aValue;
	}	

	/**
	 * 是否可用	 * @return Short
	 * @hibernate.property column="isEnabled" type="java.lang.Short" length="5" not-null="true" unique="false"
	 */
	public Short getIsEnabled() {
		return this.isEnabled;
	}
	
	/**
	 * Set the isEnabled
	 * @spring.validator type="required"
	 */	
	public void setIsEnabled(Short aValue) {
		this.isEnabled = aValue;
	}	

	/**
	 * 节点名称	 * @return String
	 * @hibernate.property column="activityName" type="java.lang.String" length="128" not-null="true" unique="false"
	 */
	public String getActivityName() {
		return this.activityName;
	}
	
	/**
	 * Set the activityName
	 * @spring.validator type="required"
	 */	
	public void setActivityName(String aValue) {
		this.activityName = aValue;
	}	

	/**
	 * Jbpm流程发布ID	 * @return String
	 * @hibernate.property column="deployId" type="java.lang.String" length="128" not-null="true" unique="false"
	 */
	public String getDeployId() {
		return this.deployId;
	}
	
	/**
	 * Set the deployId
	 * @spring.validator type="required"
	 */	
	public void setDeployId(String aValue) {
		this.deployId = aValue;
	}	

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof FormDef)) {
			return false;
		}
		FormDef rhs = (FormDef) object;
		return new EqualsBuilder()
				.append(this.formDefId, rhs.formDefId)
				.append(this.formName, rhs.formName)
				.append(this.columns, rhs.columns)
				.append(this.isEnabled, rhs.isEnabled)
				.append(this.activityName, rhs.activityName)
				.append(this.deployId, rhs.deployId)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.formDefId) 
				.append(this.formName) 
				.append(this.columns) 
				.append(this.isEnabled) 
				.append(this.activityName) 
				.append(this.deployId) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("formDefId", this.formDefId) 
				.append("formName", this.formName) 
				.append("columns", this.columns) 
				.append("isEnabled", this.isEnabled) 
				.append("activityName", this.activityName) 
				.append("deployId", this.deployId) 
				.toString();
	}



}
