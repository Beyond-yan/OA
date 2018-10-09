package com.gdssoft.oa.service.admin.impl;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.cxf.ws.rm.RetransmissionCallback;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.dao.GenericDao;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.dao.admin.CarCostRecordDao;
import com.gdssoft.oa.model.admin.CarCostRecord;
import com.gdssoft.oa.service.admin.CarCostRecordService;

public class CarCostRecordServiceImpl extends BaseServiceImpl<CarCostRecord> implements CarCostRecordService {

	private CarCostRecordDao carCostRecorddao;
	public CarCostRecordServiceImpl(CarCostRecordDao carCostRecorddao) {
		super(carCostRecorddao);
		this.carCostRecorddao=carCostRecorddao;
	}

	public List<CarCostRecord> selectByCostType(Date startDate, Date endDate,int start,int size){
		return carCostRecorddao.selectByCostType(startDate, endDate,start,size);
	}
	
	public List<CarCostRecord> selectByCostDate(Date startDate, Date endDate,int start,int size,String selectBy){
		return carCostRecorddao.selectByCostDate(startDate, endDate,start,size,selectBy);
	}
	
	public List<CarCostRecord> selectByCarAndTime(Date startDate, Date endDate,int start,int size){
		return carCostRecorddao.selectByCarAndTime(startDate, endDate,start,size);
		
	}
	
	public Long count(Date startDate,Date endDate){
		return carCostRecorddao.count(startDate, endDate);
	}
	
	public Long countByTypeName(Date startDate,Date endDate){
		return carCostRecorddao.countByTypeName(startDate, endDate);
		
	}
	public Long countByCostDate(Date startDate,Date endDate,String selectBy){
		return carCostRecorddao.countByCostDate(startDate, endDate,selectBy);
	}
	
   public List<CarCostRecord> selectByCarAndType(Date startDate, Date endDate,int start,int size){
	   return carCostRecorddao.selectByCarAndType(startDate, endDate, start, size);
   }
	
	public Long countByCarAndType(Date startDate,Date endDate){
		return carCostRecorddao.countByCarAndType(startDate, endDate);
	}
	
	public List<CarCostRecord> costStatistics(Date startDate, Date endDate,String selectBy,String carIds){
		return carCostRecorddao.costStatistics(startDate, endDate,selectBy,carIds);
	}
	
	public Float totalAmtSumTypeName(Date startDate, Date endDate){
		return carCostRecorddao.totalAmtSumTypeName(startDate, endDate);
	}
	
    public Float totalSumCarAndTime(Date startDate, Date endDate){
    	return carCostRecorddao.totalSumCarAndTime(startDate, endDate);
    }
	
	public Float totalSumCostDate(Date startDate, Date endDate,String selectBy){
		return carCostRecorddao.totalSumCostDate(startDate, endDate,selectBy);
	}
	
	public Float totalSumCarAndType(Date startDate, Date endDate){
		return carCostRecorddao.totalSumCarAndType(startDate, endDate);
	}
	
	/**
	 * 费用统计2
	 */

	public Map<String, Map> costStatisticsTwoService(Date startTime,Date endTime,String selectBy,String carIds) {
		List<CarCostRecord> list = null;
		list = costStatistics(startTime, endTime,selectBy, carIds);
		DecimalFormat df=new DecimalFormat("0.00");
		BigDecimal total4 = new BigDecimal(0);// 总计的总计的合计
		BigDecimal total3 =new BigDecimal(0);// 总计的里程合计
		BigDecimal total2 = new BigDecimal(0);// 一种费用类别的合计
		int m = 0;
		int n = 0;
		float array[] = null;
		int count = 0;
		BigDecimal total = new BigDecimal(0);// 每个车的所有费用的合计
		for (int j = 0; j < list.size(); j++) {// 几种费用类别
			if (list.get(0).getCostComment()
					.equals(list.get(j).getCostComment())) {
				count += 1;
			}
		}
		n = list.size() / count;// 几辆车
		
		 Map<String, Map>map2 = new LinkedHashMap<String, Map>();
		for (int i = 0; i < n; i++) {
			Map<String, String> map1 = new LinkedHashMap<String, String>();
			total = new BigDecimal(0);
			map1.put("驾驶员", list.get(i).getCreateUser());//司机
			map1.put("里程", list.get(i).getItemQty().toString());//里程	
			total3 = total3.add(BigDecimal.valueOf(list.get(i).getItemQty()));// 所有车的里程总计	
			//System.out.println("第"+i+"个的开始");
			for (int j = i; j < list.size(); j += n) {
				map1.put(list.get(j).getTypeName(), list.get(j).getTotalAmt().toString());
				total=total.add(BigDecimal.valueOf(list.get(j).getTotalAmt()));
				//System.out.println("费用类别数量"+df.format(list.get(j).getTotalAmt()));			
			}
			//System.out.println("第"+i+"个的相加"+total);
			//System.out.println("第"+i+"个的结束");
			total4 =total4.add(total);// 总计中的合计						
			map1.put("合计", total.toString());
			map2.put(list.get(i).getCostComment(), map1);// 车牌号和其对应的值	
		}
		Map<String, String> map3 = new LinkedHashMap<String, String>();	
		map3.put("驾驶员", " ");
		map3.put("里程", total3.toString());
		for (int i = 0; i < list.size(); i++) {
			total2 = total2.add(BigDecimal.valueOf(list.get(i).getTotalAmt()));
			if ((i + 1) % n == 0) {
				map3.put(list.get(i).getTypeName(), total2.toString());
				total2 = new BigDecimal(0);
			}
		}	
		map3.put("合计", total4.toString());
		map2.put("总计", map3);
		return map2;
	}
}
