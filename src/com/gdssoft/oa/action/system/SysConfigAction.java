package com.gdssoft.oa.action.system;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import com.gdssoft.oa.model.system.SysConfig;
import com.gdssoft.oa.service.system.SysConfigService;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.AppUtil;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;

import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class SysConfigAction extends BaseAction{
	@Resource
	private SysConfigService sysConfigService;
	private SysConfig sysConfig;
	
	private Long configId;

	public Long getConfigId() {
		return configId;
	}

	public void setConfigId(Long configId) {
		this.configId = configId;
	}

	public SysConfig getSysConfig() {
		return sysConfig;
	}

	public void setSysConfig(SysConfig sysConfig) {
		this.sysConfig = sysConfig;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<SysConfig> list= sysConfigService.getAll(filter);
		
		Type type=new TypeToken<List<SysConfig>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
		Gson gson=new Gson();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		
		jsonString=buff.toString();
		
//		System.out.println("=======6666======="+jsonString);
		
		return SUCCESS;
	}
	/**
	 * 批量删除
	 * @return
	 */
	public String multiDel(){
		
		String[]ids=getRequest().getParameterValues("ids");
		if(ids!=null){
			for(String id:ids){
				sysConfigService.remove(new Long(id));
			}
		}
		
		jsonString="{success:true}";
		
		return SUCCESS;
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String get(){
		SysConfig sysConfig=sysConfigService.get(configId);
		
		Gson gson=new Gson();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(sysConfig));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		Map con=AppUtil.getSysConfig();
		Map map=getRequest().getParameterMap();
		Iterator it=map.entrySet().iterator();
		while(it.hasNext()){
			Map.Entry entry=(Map.Entry)it.next();
			String key=(String)entry.getKey();
			SysConfig conf=sysConfigService.findByKey(key);
			String[] value=(String[])entry.getValue();
			conf.setDataValue(value[0]);			
			sysConfigService.save(conf);
			con.remove(key);
			con.put(key,value[0]);
		}
		
		//更新系统配置的Map 
    	AppUtil.reloadSysConfig();
    	
		setJsonString("{success:true}");
		return SUCCESS;
	}
	
	public String load(){
		Map conf=sysConfigService.findByType();
		JSONSerializer json = JsonUtil.getJSONSerializer("");
		setJsonString("{success:true,data:"+json.serialize(conf)+"}");
		return SUCCESS;
	}
	
	public String getOne(){
		String typeKey = getRequest().getParameter("typeKey");
		String configKey = getRequest().getParameter("configKey");
		SysConfig sysConfig=sysConfigService.findDataValueByTkCkey(typeKey,configKey);Gson gson=new Gson();
		
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(sysConfig));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	
	/**
	 * 通过typeKey获取数集
	 * add by hejianghai
	 * @return
	 */
	public String findDataByTypeKey(){
		String typeKey = getRequest().getParameter("typeKey");
		List<SysConfig> list = sysConfigService.findDataByTypeKey(typeKey);
		System.out.println("list.size:" + list.size());
		Gson gson=new Gson();
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(list));
		sb.append("}");
		setJsonString(sb.toString());
		return SUCCESS;
	}
	
	/**
	 * 通过dataType和configKey获取数集
	 * add by ropen
	 * @return
	 */
	public String findDataByDtCkey(){
		String dataType = getRequest().getParameter("dataType");
		String configKey = getRequest().getParameter("configKey");
        SysConfig sysConfig=sysConfigService.findDataValueByTkCkey(dataType,configKey);
        Gson gson=new Gson();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(sysConfig));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
}
