package com.gdssoft.oa.service.flow.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.flow.ProcessFormDao;
import com.gdssoft.oa.model.flow.ProcessForm;
import com.gdssoft.oa.service.flow.ProcessFormService;

public class ProcessFormServiceImpl extends BaseServiceImpl<ProcessForm> implements ProcessFormService{
	private ProcessFormDao dao;
	
	public ProcessFormServiceImpl(ProcessFormDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	/**
	 * 取得某个流程实例的所有表单
	 * @param runId
	 * @return
	 */
	public List getByRunId(Long runId){
		return dao.getByRunId(runId);
	}
	public List getBySchemacodeRunId(Long runId,String Schemacode){
		return dao.getBySchemacodeRunId(runId,Schemacode);
	}
	
	/**
	 * 查找某个流程某个任务的表单数据
	 * @param runId
	 * @param activityName
	 * @return
	 */
	public ProcessForm getByRunIdActivityName(Long runId,String activityName){
		return dao.getByRunIdActivityName(runId, activityName);
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.gdssoft.oa.service.flow.ProcessFormService#getActvityExeTimes(java.lang.Long, java.lang.String)
	 */
	public Long getActvityExeTimes(Long runId,String activityName){
		return dao.getActvityExeTimes(runId, activityName);
	}
	
	/**
	 * 构造最新的流程实例对应的所有字段及数据
	 * @param runId
	 * @return
	 */
	public Map getVariables(Long runId){
		return dao.getVariables(runId);
	}
	public Map getVariables(Long runId,String SchemaCode){
		return dao.getVariables(runId,SchemaCode);
	}
	/**
	 * 构造出以活动名称为key,审批人+审批意见+审批时间组合值为value
	 * @param runId
	 * @return
	 */
	public Map<String,List<ProcessForm>> getProcessFormDetail(Long runId){
		List<ProcessForm> formList = getByRunId(runId);
		Map<String,List<ProcessForm>> mapForm =  new HashMap();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		for(ProcessForm form : formList){
			String mapKey = form.getActivityName();
			if(!mapForm.containsKey(mapKey))
				mapForm.put(mapKey, new ArrayList<ProcessForm>());
			mapForm.get(mapKey).add(form);
		}
		return mapForm;
	}

}