package com.gdssoft.oa.service.system;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.List;
import java.util.Map;

import com.gdssoft.oa.model.system.SysConfig;
import com.gdssoft.core.service.BaseService;

public interface SysConfigService extends BaseService<SysConfig>{
	/**
	 * 根据KEY来取配置对象
	 * @param key
	 * @return
	 */
	public SysConfig findByKey(String key);
	
	/**
	 * 按类查找配置列表
	 * @return
	 */
	public Map findByType();
	/**
	 * 根据typeKey和 configKey获得 配置值
	 * @param typeKey
	 * @param configKey
	 * @return
	 */
	public SysConfig findDataValueByTkCkey(String typeKey,String configKey);
	
	public List<SysConfig> findDataByTypeKey(String typeKey);
	
	/**
	 * 根据dataType和 configKey获得 配置值
	 * @param dataType
	 * @param configKey
	 * @return
	 */
	public SysConfig findDataValueByDtCkey(String dataType,String configKey);
	
	public SysConfig findDataValueByTkCkeyWithSchema(String schema, String typeKey,String configKey);
}


