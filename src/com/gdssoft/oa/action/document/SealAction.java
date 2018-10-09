package com.gdssoft.oa.action.document;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;
import javax.annotation.Resource;

import java.lang.reflect.Type;

import com.gdssoft.oa.model.document.Seal;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.document.SealService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.JsonUtil;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;



import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class SealAction extends BaseAction{
	@Resource
	private SealService sealService;
	private Seal seal;
	
	private Long sealId;

	public Long getSealId() {
		return sealId;
	}

	public void setSealId(Long sealId) {
		this.sealId = sealId;
	}

	public Seal getSeal() {
		return seal;
	}

	public void setSeal(Seal seal) {
		this.seal = seal;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<Seal> list= sealService.getAll(filter);
		
//		Type type=new TypeToken<List<Seal>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
//		Gson gson=new Gson();
		JSONSerializer json=JsonUtil.getJSONSerializer();
		buff.append(json.serialize(list));
		buff.append("}");
		
		jsonString=buff.toString();
		
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
				sealService.remove(new Long(id));
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
		Seal seal=sealService.get(sealId);
		
//		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		JSONSerializer json=JsonUtil.getJSONSerializer();
		json.exclude("class");
		sb.append(json.serialize(seal));
//		sb.append(gson.toJson(seal));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		if(seal.getSealId()==null){
			seal.setBelongId(ContextUtil.getCurrentUserId());
			sealService.save(seal);
		}else{
			Seal orgSeal=sealService.get(seal.getSealId());
			try{
				BeanUtil.copyNotNullProperties(orgSeal, seal);
				sealService.save(orgSeal);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
}
