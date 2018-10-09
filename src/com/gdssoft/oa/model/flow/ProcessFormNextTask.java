package com.gdssoft.oa.model.flow;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/

import com.google.gson.annotations.Expose;
/**
 * FormData Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * TODO: add class/table comments
 */
public class ProcessFormNextTask extends com.gdssoft.core.model.BaseModel {
	
	@Expose
    protected Long dataId;
	protected Long taskId;
	protected Long formId;
	
	public Long getDataId() {
		return dataId;
	}
	public void setDataId(Long dataId) {
		this.dataId = dataId;
	}
	public Long getTaskId() {
		return taskId;
	}
	public void setTaskId(Long taskId) {
		this.taskId = taskId;
	}
	public Long getFormId() {
		return formId;
	}
	public void setFormId(Long formId) {
		this.formId = formId;
	}
}
