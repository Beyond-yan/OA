package com.gdssoft.oa.service.flow.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.gdssoft.oa.dao.flow.FormDataDao;
import com.gdssoft.oa.model.flow.FormData;
import com.gdssoft.oa.service.flow.FormDataService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class FormDataServiceImpl extends BaseServiceImpl<FormData> implements FormDataService{
	private FormDataDao dao;
	
	public FormDataServiceImpl(FormDataDao dao) {
		super(dao);
		this.dao=dao;
	}
	/*
	 * (non-Javadoc)
	 * @see com.gdssoft.oa.service.flow.FormDataService#getFromDataMap(java.lang.Long, java.lang.String)
	 */
	public Map<String,Object> getFromDataMap(Long runId,String activityName){
		List<FormData> list=dao.getByRunIdActivityName(runId, activityName);
		Map dataMap=new HashMap();
		for(FormData form:list){
			dataMap.put(form.getFieldName(),form.getValue());
		}
		return dataMap;
	}
	
	public FormData getByFormIdFieldName(Long formId,String fieldName){
		FormData formData=dao.getByFormIdFieldName(formId, fieldName);
		return formData;
	}
}