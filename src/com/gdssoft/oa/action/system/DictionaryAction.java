package com.gdssoft.oa.action.system;
import java.util.List;
import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import java.lang.reflect.Type;

import com.gdssoft.oa.model.system.Dictionary;
import com.gdssoft.oa.model.system.GlobalType;
import com.gdssoft.oa.service.system.DictionaryService;
import com.gdssoft.oa.service.system.GlobalTypeService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.web.action.BaseAction;




import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class DictionaryAction extends BaseAction{
	@Resource
	private DictionaryService dictionaryService;
	@Resource
	private GlobalTypeService globalTypeService;
	
	private Dictionary dictionary;
	
	private Long dicId;
	
	private String itemName;
	
	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	public Long getDicId() {
		return dicId;
	}

	public void setDicId(Long dicId) {
		this.dicId = dicId;
	}

	public Dictionary getDictionary() {
		return dictionary;
	}

	public void setDictionary(Dictionary dictionary) {
		this.dictionary = dictionary;
	}
	
	public String mulSave(){
		String data =getRequest().getParameter("data");
		
		if(StringUtils.isNotEmpty(data)){
			Gson gson=new Gson();
			Dictionary[]dics=gson.fromJson(data, Dictionary[].class);
			
			for(int i=0;i<dics.length;i++){
				Dictionary dic=dictionaryService.get(dics[i].getDicId());
				try{
					BeanUtil.copyNotNullProperties(dic, dics[i]);
					
					dictionaryService.save(dic);
				}catch(Exception ex){
					logger.error(ex.getMessage());
				};
			}
		}
		
		jsonString="{success:true}";
		return SUCCESS;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		String sParentId=getRequest().getParameter("parentId");
		if(StringUtils.isNotEmpty(sParentId)&& !"0".equals(sParentId)){
			GlobalType globalType=globalTypeService.get(new Long(sParentId));
			filter.addFilter("Q_globalType.path_S_LFK", globalType.getPath());
		}
		List<Dictionary> list= dictionaryService.getAll(filter);
		Type type=new TypeToken<List<Dictionary>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
		//Gson gson=new GsonBuilder().create();
		//buff.append(gson.toJson(list, type));
		
		JSONSerializer json=new JSONSerializer();
		buff.append(json.serialize(list));
		
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	/**
	 * 根据条目查询出字典的value并返回数组
	 * @return
	 */
	public String load(){
		List<String> list= dictionaryService.getAllByItemName(itemName);
		StringBuffer buff = new StringBuffer("[");
		for(String itemName : list){
			buff.append("'").append(itemName).append("',");
		}
		if(list.size()>0){
			buff.deleteCharAt(buff.length()-1);
		}
		buff.append("]");
		setJsonString(buff.toString());
		return SUCCESS;
	}
	
	public String loadItem(){
		List<Dictionary> list= dictionaryService.getByItemName(itemName);
		StringBuffer buff = new StringBuffer("[");
		for(Dictionary dic : list){
			buff.append("[").append(dic.getDicId()).append(",'").append(dic.getItemValue()).append("'],");
			
		}
		if(list.size()>0){
			buff.deleteCharAt(buff.length()-1);
		}
		buff.append("]");
		setJsonString(buff.toString());
		return SUCCESS;
	}
	
	public String loadItemRecord(){
		List<Dictionary> list= dictionaryService.getByItemName(itemName);
		Gson gson=new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(list));
		sb.append("}");
		setJsonString(sb.toString());
		return SUCCESS;
	}
	
	
	public String typeChange(){
		String dicIds=getRequest().getParameter("dicIds");
		String dicTypeId=getRequest().getParameter("dicTypeId");
		
		if(StringUtils.isNotEmpty(dicIds) && StringUtils.isNotEmpty(dicTypeId)){
			GlobalType globalType=globalTypeService.get(new Long(dicTypeId));
			
			String[]ids=dicIds.split("[,]");
			if(ids!=null){
				for(String id:ids){
					Dictionary dic=dictionaryService.get(new Long(id));
					dic.setGlobalType(globalType);
					dic.setItemName(globalType.getTypeName());
					
					dictionaryService.save(dic);
				}
			}
		}
		setJsonString("{success:true}");
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
				dictionaryService.remove(new Long(id));
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
		Dictionary dictionary=dictionaryService.get(dicId);
		
		Gson gson=new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(dictionary));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		if(dictionary.getDicId()!=null){
			Dictionary orgDic=dictionaryService.get(dictionary.getDicId());
			try{
				BeanUtil.copyNotNullProperties(orgDic, dictionary);
				dictionaryService.save(orgDic);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}else{
			String parentId=getRequest().getParameter("parentId");
			if(StringUtils.isNotEmpty(parentId)){
				GlobalType globalType=globalTypeService.get(new Long(parentId));
				dictionary.setGlobalType(globalType);
			}
			dictionaryService.save(dictionary);
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}
	
	/**
	 * 获得条目
	 * @return
	 */
	public String items(){
		List<String> list = dictionaryService.getAllItems();
		StringBuffer buff = new StringBuffer("[");
		for(String str : list){
			buff.append("'").append(str).append("',");
		}
		if(list.size() > 0){
			buff.deleteCharAt(buff.length() - 1);
		}
		buff.append("]");
		setJsonString(buff.toString());
		return SUCCESS;
	}
}
