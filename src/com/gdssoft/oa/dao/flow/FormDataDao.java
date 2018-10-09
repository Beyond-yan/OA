package com.gdssoft.oa.dao.flow;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.model.flow.FormData;
import com.gdssoft.core.dao.BaseDao;

/**
 * 
 * @author 
 *
 */
public interface FormDataDao extends BaseDao<FormData>{
	/**
	 * 取得某个流程某个活动下的表单数据
	 * @param runId
	 * @param activityName
	 * @return
	 */
	public List<FormData> getByRunIdActivityName(Long runId,String activityName);
	
	/**
	 * 取得某个表单某个字段的数据
	 * @param formId
	 * @param fieldName
	 * @return
	 */
	public FormData getByFormIdFieldName(Long formId,String fieldName);
}