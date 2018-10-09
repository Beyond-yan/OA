package com.gdssoft.oa.action.flow;

import java.lang.reflect.Type;
import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.flow.CcuserProcess;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.flow.SealApply;
import com.gdssoft.oa.service.flow.CcuserProcessService;
import com.gdssoft.oa.service.flow.ProcessRunService;
import com.google.gson.reflect.TypeToken;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;

public class CcuserProcessAction extends BaseAction{
	@Resource
	CcuserProcessService ccuserProcessService;
	@Resource
	private ProcessRunService processRunService;
	
	/**
	 * 显示列表
	 */
	public String myList(){
		ProcessRun processRun = processRunService.getByTaskId(taskId.toString());	
		
		QueryFilter filter=new QueryFilter(getRequest());
		filter.addFilter("Q_processRunId_L_EQ", processRun.getRunId().toString());
		List<CcuserProcess> list = ccuserProcessService.getAll(filter);
		
		Type type=new TypeToken<List<CcuserProcess>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
		JSONSerializer serializer=new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"), "createDate");
        buff.append(serializer.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");
		
		jsonString=buff.toString();
		
		
		return SUCCESS;
	}
	
	/**
	 * 更新为已读
	 * @return
	 */
	public String updateRead(){
		Long curUserId = ContextUtil.getCurrentUserId();
		ccuserProcessService.updateStatus(curUserId.intValue(), processRunId, 1);
		return SUCCESS;
	}
	
	//页面传值
	private CcuserProcess ccuserProcess;
	private Long taskId;
	
	private int processRunId;
	
	

	public int getProcessRunId() {
		return processRunId;
	}

	public void setProcessRunId(int processRunId) {
		this.processRunId = processRunId;
	}

	public CcuserProcess getCcuserProcess() {
		return ccuserProcess;
	}

	public void setCcuserProcess(CcuserProcess ccuserProcess) {
		this.ccuserProcess = ccuserProcess;
	}

	public Long getTaskId() {
		return taskId;
	}

	public void setTaskId(Long taskId) {
		this.taskId = taskId;
	}
	
	
	
}
