package com.gdssoft.oa.dao.system;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.model.system.SysConfig;
import com.gdssoft.core.dao.BaseDao;

/**
 * 
 * @author 
 *
 */
public interface SysConfigDao extends BaseDao<SysConfig>{
	
	public SysConfig findByKey(String key);
	
	public List<SysConfig> findConfigByTypeKey(String typeKey);
	
	public List findTypeKeys();
	
	/**
	 * lxw add
	 * @param typeKey
	 * @param configKey
	 * @return
	 */
	public SysConfig findDataValueByTkCkey(String typeKey,String configKey);
	
	/**
	 * 根据dataType和 configKey获得 配置值
	 * @param dataType
	 * @param configKey
	 * @return
	 */
	public SysConfig findDataValueByDtCkey(String dataType,String configKey);
	
	public SysConfig findDataValueByTkCkeyWithSchema(String schema, String typeKey, String configKey);
	
}