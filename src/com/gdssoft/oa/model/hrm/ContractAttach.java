package com.gdssoft.oa.model.hrm;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * ContractAttach Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * TODO: add class/table comments
 */
public class ContractAttach extends com.gdssoft.core.model.BaseModel {

    protected Long fileId;
	protected com.gdssoft.oa.model.system.FileAttach fileAttach;
	protected com.gdssoft.oa.model.hrm.UserContract userContract;


	/**
	 * Default Empty Constructor for class ContractAttach
	 */
	public ContractAttach () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class ContractAttach
	 */
	public ContractAttach (
		 Long in_fileId
        ) {
		this.setFileId(in_fileId);
    }

	
	public com.gdssoft.oa.model.system.FileAttach getFileAttach () {
		return fileAttach;
	}	
	
	public void setFileAttach (com.gdssoft.oa.model.system.FileAttach in_fileAttach) {
		this.fileAttach = in_fileAttach;
	}
	
	public com.gdssoft.oa.model.hrm.UserContract getUserContract () {
		return userContract;
	}	
	
	public void setUserContract (com.gdssoft.oa.model.hrm.UserContract in_userContract) {
		this.userContract = in_userContract;
	}
    

	/**
	 * 	 * @return Long
     * @hibernate.id column="fileId" type="java.lang.Long" generator-class="native"
	 */
	public Long getFileId() {
		return this.fileId;
	}
	
	/**
	 * Set the fileId
	 */	
	public void setFileId(Long aValue) {
	    if (aValue==null) {
	    	fileAttach = null;
	    } else {
	        fileAttach = new com.gdssoft.oa.model.system.FileAttach(aValue);
	        fileAttach.setVersion(new Integer(0));//set a version to cheat hibernate only
	    }
		this.fileId = aValue;
	}	

	/**
	 * 	 * @return Long
	 */
	public Long getContractId() {
		return this.getUserContract()==null?null:this.getUserContract().getContractId();
	}
	
	/**
	 * Set the contractId
	 */	
	public void setContractId(Long aValue) {
	    if (aValue==null) {
	    	userContract = null;
	    } else if (userContract == null) {
	        userContract = new com.gdssoft.oa.model.hrm.UserContract(aValue);
	        userContract.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			userContract.setContractId(aValue);
	    }
	}	

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof ContractAttach)) {
			return false;
		}
		ContractAttach rhs = (ContractAttach) object;
		return new EqualsBuilder()
				.append(this.fileId, rhs.fileId)
						.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.fileId) 
						.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("fileId", this.fileId) 
						.toString();
	}



}
