package com.gdssoft.oa.dao.flow.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.oa.dao.flow.ProcessFormNextTaskDao;
import com.gdssoft.oa.model.flow.ProcessFormNextTask;
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.util.ContextUtil;

public class ProcessFormNextTaskDaoImpl extends BaseDaoImpl<ProcessFormNextTask> implements ProcessFormNextTaskDao{

	public ProcessFormNextTaskDaoImpl() {
		super(ProcessFormNextTask.class);
	}
	
	public List getByTaskId(Long taskId){
		//String hql="from ProcessFormNextTask pf where pf.processRun.runId=? and pf.activityName!=? order by pf.formId asc";
		String hql="from ProcessFormNextTask pf where pf.taskId=?  order by pf.formId asc";
		return findByHql(hql, new Object[]{taskId});
	}

	public List getByFormId(Long formId){
		//String hql="from ProcessFormNextTask pf where pf.processRun.runId=? and pf.activityName!=? order by pf.formId asc";
		String hql="from ProcessFormNextTask pf where pf.formId=?  order by pf.formId asc";
		return findByHql(hql, new Object[]{formId});
	}
	public Map<Object,Object> getPreTaskCount(String taskId,String sourceName){
		StringBuffer sql=new StringBuffer("");
		String schema = "";
		if(StringUtils.isNotBlank(schema)) schema = schema+".";
		if(null != ContextUtil.getCurrentUser()){
			if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
				schema = ContextUtil.getCurrentUser().getOwnerSchema()+".";
		}
		sql.append(" SELECT COUNT(1) NUM,PFNT1.FORMID FORMID");
		sql.append(" FROM "+schema+"PROCESS_FORM_NEXT_TASK PFNT1,"+schema+"PROCESS_FORM_NEXT_TASK PFNT2,"+schema+"JBPM4_TASK JT");
		sql.append(" WHERE PFNT1.FORMID=PFNT2.FORMID AND PFNT2.TASKID=JT.DBID_");
		sql.append(" AND PFNT1.TASKID="+taskId);
		sql.append(" AND JT.ACTIVITY_NAME_='"+sourceName+"'");
		sql.append(" GROUP BY PFNT1.FORMID");
		Map<Object,Object> map = this.jdbcTemplate.queryForMap(sql.toString());
		return map;
	}
}