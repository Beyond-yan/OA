package com.gdssoft.oa.dao.flow.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.dao.flow.FormDataDao;
import com.gdssoft.oa.model.flow.FormData;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class FormDataDaoImpl extends BaseDaoImpl<FormData> implements FormDataDao{

	public FormDataDaoImpl() {
		super(FormData.class);
	}
	
	/**
	 * 取得某个流程某个活动下的表单数据
	 * @param runId
	 * @param activityName
	 * @return
	 */
	public List<FormData> getByRunIdActivityName(Long runId,String activityName){
		String hql="from FormData fd where fd.processForm.processRun.runId=? and fd.processForm.activityName=?";
		return findByHql(hql,new Object[]{runId,activityName});
	}
	/*
	 * (non-Javadoc)
	 * @see com.gdssoft.oa.dao.flow.FormDataDao#getByFormIdFieldName(java.lang.Long, java.lang.String)
	 */
	public FormData getByFormIdFieldName(Long formId,String fieldName){
		String hql="from FormData fd where fd.processForm.formId=? and fd.fieldName=?";
		return (FormData)findUnique(hql, new Object[]{formId,fieldName});
	}

}