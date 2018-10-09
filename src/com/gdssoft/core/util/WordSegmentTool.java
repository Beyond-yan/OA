package com.gdssoft.core.util;

import java.io.IOException;
import java.util.List;

import org.apdplat.word.WordSegmenter;
import org.apdplat.word.segmentation.SegmentationAlgorithm;
import org.apdplat.word.segmentation.Word;
public class WordSegmentTool {
	
	
	public String segmentWord(String searchStr) throws IOException{
		
		   String segmentWordStr= "";
		  /**
		   * 分词方法，可以指定分词算法（此处为双向最大匹配分词算法）
		   */
			List<Word> words = WordSegmenter.seg(searchStr, SegmentationAlgorithm.BidirectionalMaximumMatching);	
			if(words.size()!=0){
		        for (Word word : words) {
					segmentWordStr +=word.getText()+"* ";
				}	
			}else{ 
				segmentWordStr = searchStr+"*";
			}
			
			System.out.print(segmentWordStr);
		 
		return segmentWordStr;
	}

}
