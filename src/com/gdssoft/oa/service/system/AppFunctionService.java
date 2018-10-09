package com.gdssoft.oa.service.system;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import com.gdssoft.oa.model.system.AppFunction;
import com.gdssoft.core.service.BaseService;

public interface AppFunctionService extends BaseService<AppFunction>{
	/**
	 * 按Key 取得Function的值
	 * @param key
	 * @return
	 */
	public AppFunction getByKey(String key);
}


