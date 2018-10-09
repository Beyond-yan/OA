package com.gdssoft.oa.service.system.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.gdssoft.oa.dao.system.SysConfigDao;
import com.gdssoft.oa.model.system.SysConfig;
import com.gdssoft.oa.service.system.SysConfigService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class SysConfigServiceImpl extends BaseServiceImpl<SysConfig> implements SysConfigService{
	private SysConfigDao dao;
	
	public SysConfigServiceImpl(SysConfigDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public SysConfig findByKey(String key) {
		return dao.findByKey(key);
	}

	@Override
	public Map findByType() {
		List<String> list=dao.findTypeKeys();
		Map cList=new HashMap();
		for(String typeKey:list){
			List<SysConfig> confList=dao.findConfigByTypeKey(typeKey);
			cList.put(typeKey, confList);
		}
		return cList;
	}

	@Override
	public SysConfig findDataValueByTkCkey(String typeKey, String configKey) {
		// TODO Auto-generated method stub
		return dao.findDataValueByTkCkey(typeKey,configKey);
	}
//20110711 cxt 
	@Override
	public List  findDataByTypeKey(String typeKey) {
		// TODO Auto-generated method stub
		//List<SysConfig> sysConf1=dao.findConfigByTypeKey(typeKey);
		
		return dao.findConfigByTypeKey(typeKey);
	}

	@Override
	public SysConfig findDataValueByDtCkey(String dataType, String configKey) {
		// TODO Auto-generated method stub
		return dao.findDataValueByDtCkey(dataType,configKey);
	}

	@Override
	public SysConfig findDataValueByTkCkeyWithSchema(String schema, String typeKey,
			String configKey) {
		return dao.findDataValueByTkCkeyWithSchema(schema, typeKey, configKey);
	}
	

}