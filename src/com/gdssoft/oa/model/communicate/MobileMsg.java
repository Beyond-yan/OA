package com.gdssoft.oa.model.communicate;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * MobileMsg Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * TODO: add class/table comments
 */
public class MobileMsg extends com.gdssoft.core.model.BaseModel {

	public static final Short STATUS_INIT=0;
	public static final Short STATUS_SUCESS=1;
	public static final Short STATUS_FAIL=2;
	
    protected Long msgId;
	protected String content;
	protected String mobileNo;
	protected java.util.Date createtime;
	protected Short status;


	/**
	 * Default Empty Constructor for class MobileMsg
	 */
	public MobileMsg () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class MobileMsg
	 */
	public MobileMsg (
		 Long in_msgId
        ) {
		this.setMsgId(in_msgId);
    }

    

	/**
	 * 	 * @return Long
     * @hibernate.id column="msgId" type="java.lang.Long" generator-class="native"
	 */
	public Long getMsgId() {
		return this.msgId;
	}
	
	/**
	 * Set the msgId
	 */	
	public void setMsgId(Long aValue) {
		this.msgId = aValue;
	}	

	/**
	 * 发送内容	 * @return String
	 * @hibernate.property column="content" type="java.lang.String" length="512" not-null="true" unique="false"
	 */
	public String getContent() {
		return this.content;
	}
	
	/**
	 * Set the content
	 * @spring.validator type="required"
	 */	
	public void setContent(String aValue) {
		this.content = aValue;
	}	

	/**
	 * 手机号	 * @return String
	 * @hibernate.property column="mobileNo" type="java.lang.String" length="64" not-null="true" unique="false"
	 */
	public String getMobileNo() {
		return this.mobileNo;
	}
	
	/**
	 * Set the mobileNo
	 * @spring.validator type="required"
	 */	
	public void setMobileNo(String aValue) {
		this.mobileNo = aValue;
	}	

	/**
	 * 创建时间	 * @return java.util.Date
	 * @hibernate.property column="createtime" type="java.util.Date" length="19" not-null="true" unique="false"
	 */
	public java.util.Date getCreatetime() {
		return this.createtime;
	}
	
	/**
	 * Set the createtime
	 * @spring.validator type="required"
	 */	
	public void setCreatetime(java.util.Date aValue) {
		this.createtime = aValue;
	}	

	/**
	 * 状态
            0=未发送
            1=发送成功
            2=发送失败	 * @return Short
	 * @hibernate.property column="status" type="java.lang.Short" length="5" not-null="false" unique="false"
	 */
	public Short getStatus() {
		return this.status;
	}
	
	/**
	 * Set the status
	 */	
	public void setStatus(Short aValue) {
		this.status = aValue;
	}	

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof MobileMsg)) {
			return false;
		}
		MobileMsg rhs = (MobileMsg) object;
		return new EqualsBuilder()
				.append(this.msgId, rhs.msgId)
				.append(this.content, rhs.content)
				.append(this.mobileNo, rhs.mobileNo)
				.append(this.createtime, rhs.createtime)
				.append(this.status, rhs.status)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.msgId) 
				.append(this.content) 
				.append(this.mobileNo) 
				.append(this.createtime) 
				.append(this.status) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("msgId", this.msgId) 
				.append("content", this.content) 
				.append("mobileNo", this.mobileNo) 
				.append("createtime", this.createtime) 
				.append("status", this.status) 
				.toString();
	}



}
