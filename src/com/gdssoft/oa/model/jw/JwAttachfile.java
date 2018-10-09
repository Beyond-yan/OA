package com.gdssoft.oa.model.jw;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * JwAttachfile Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class JwAttachfile extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected String attachcode;
	protected String filepath;


	/**
	 * Default Empty Constructor for class JwAttachfile
	 */
	public JwAttachfile () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class JwAttachfile
	 */
	public JwAttachfile (
		 Long in_id
        ) {
		this.setId(in_id);
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
	 * 	 * @return String
	 * @hibernate.property column="ATTACHCODE" type="java.lang.String" length="100" not-null="false" unique="false"
	 */
	public String getAttachcode() {
		return this.attachcode;
	}
	
	/**
	 * Set the attachcode
	 */	
	public void setAttachcode(String aValue) {
		this.attachcode = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="FILEPATH" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getFilepath() {
		return this.filepath;
	}
	
	/**
	 * Set the filepath
	 */	
	public void setFilepath(String aValue) {
		this.filepath = aValue;
	}	

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof JwAttachfile)) {
			return false;
		}
		JwAttachfile rhs = (JwAttachfile) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
				.append(this.attachcode, rhs.attachcode)
				.append(this.filepath, rhs.filepath)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.id) 
				.append(this.attachcode) 
				.append(this.filepath) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("id", this.id) 
				.append("attachcode", this.attachcode) 
				.append("filepath", this.filepath) 
				.toString();
	}



}
