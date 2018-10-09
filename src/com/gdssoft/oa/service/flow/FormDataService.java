package com.gdssoft.oa.service.flow;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.Map;

import com.gdssoft.oa.model.flow.FormData;
import com.gdssoft.core.service.BaseService;

public interface FormDataService extends BaseService<FormData>{
	/**
	 * 取得某个运行任务中的表单数据，返回一个Map,其值为name:value
	 * @param runId
	 * @param activityName
	 * @return
	 */
	Map<String,Object> getFromDataMap(Long runId,String activityName); 
	FormData getByFormIdFieldName(Long formId,String fieldName);
}


